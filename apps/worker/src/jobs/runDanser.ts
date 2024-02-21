import { type RecordJob } from '@bot/queue';
import type Bull from 'bullmq';
import { execFile } from 'child_process';
import { storageModel } from 'mongo';
import {
    deleteFile,
    download,
    exists,
    fromMonorepoRoot,
    makeDir,
    readFileAsStream,
    sha1hash,
    writeFile
} from '@bot/utils';
import { uploadToObjectStorage } from '@bot/storage';
import path from 'path';
import { s3Client } from 'storage';
import { env } from 'env';

const { S3_BUCKET_NAME } = env;

/**
 * Run the Danser executable with the given options to process a replay into a video.
 * Downloads the replay file from the database and saves it to a temporary location before running Danser.
 */
export async function runDanserJob(job: Bull.Job<RecordJob>): Promise<void> {
    console.log('Processing job:', job.data);

    const file = await storageModel.findById(job.data.fileId);

    if (!file) {
        throw new Error(`Replay with id ${job.data.fileId} not found`);
    }

    const replaysTempDir = fromMonorepoRoot('.data', 'replays');
    const videosTempDir = fromMonorepoRoot('.data', 'videos');
    const replaysTempDirExists = await exists(replaysTempDir);
    const videosTempDirExists = await exists(videosTempDir);

    if (!replaysTempDirExists) {
        await makeDir(replaysTempDir, { recursive: true });
    }

    if (!videosTempDirExists) {
        await makeDir(videosTempDir, { recursive: true });
    }

    const replayFileLocation = path.resolve(replaysTempDir, `${job.data.fileId}.osr`);
    const replayVideoLocation = path.resolve(videosTempDir, `${job.data.fileId}.mp4`);
    const fileBuffer = await download(new URL(file.url));

    await writeFile(replayFileLocation, fileBuffer);

    await new Promise<void>((resolve, reject) => {
        execFile(
            job.data.executable,
            [
                `--replay=${replayFileLocation}`,
                `--out=${job.data.fileId}`,
                ...job.data.danserOptions
            ],
            (error, stdout, stderr) => {
                if (error) {
                    throw error;
                }

                if (stdout) {
                    console.log(stdout);
                }

                if (stderr) {
                    console.error(stderr);
                }
            }
        ).on('exit', (code) => {
            if (code === 0) {
                resolve();
            }

            reject(new Error(`Danser exited with code ${code}`));
        });
    });

    console.info('Finished rendering video! 📽️');

    console.log(replayVideoLocation);

    const videoStream = readFileAsStream(replayVideoLocation);
    const videoHash = await sha1hash(videoStream);
    const s3Filename = `${videoHash}.mp4`;

    console.info(`Uploading ${replayVideoLocation} as ${s3Filename} to object storage...`);

    await uploadToObjectStorage(
        s3Client,
        S3_BUCKET_NAME,
        s3Filename,
        readFileAsStream(replayVideoLocation)
    );

    await Promise.all([deleteFile(replayFileLocation), deleteFile(replayVideoLocation)]);

    const fileDownloadUrl = new URL(
        `https://${env.S3_BUCKET_NAME}.${env.S3_REGION}.${env.S3_DOMAIN}`
    );

    fileDownloadUrl.pathname = `/${s3Filename}`;

    await storageModel.create({
        url: fileDownloadUrl.toString(),
        filename: `${job.data.friendlyName}.mp4`,
        filetype: 'mp4',
        shaHash: videoHash,
        ownerId: file.ownerId
    });
}
