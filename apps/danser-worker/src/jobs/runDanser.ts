import { type RecordJob } from '@bot/queue';
import type Bull from 'bullmq';
import { execFile } from 'child_process';
import { filesModel } from 'mongo';
import {
    deleteFile,
    exists,
    fromMonorepoRoot,
    makeDir,
    readFileAsStream,
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

    const file = await filesModel.findById(job.data.replayId);

    if (!file) {
        throw new Error(`Replay with id ${job.data.replayId} not found`);
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

    const replayFileLocation = path.resolve(replaysTempDir, `${job.data.replayId}.osr`);
    const replayVideoLocation = path.resolve(videosTempDir, `${job.data.replayId}.mp4`);

    await writeFile(replayFileLocation, file.buffer);

    await new Promise<void>((resolve, reject) => {
        execFile(
            job.data.executable,
            [
                `--replay=${replayFileLocation}`,
                `--out=${job.data.replayId}`,
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

    // We need two streams of the video file, one to upload to object storage and one to hash
    const filename = `${job.data.replayId}.mp4`;

    console.info(`Uploading ${replayVideoLocation} as ${filename} to object storage...`);

    await uploadToObjectStorage(
        s3Client,
        S3_BUCKET_NAME,
        filename,
        readFileAsStream(replayVideoLocation)
    );

    await Promise.all([deleteFile(replayFileLocation), deleteFile(replayVideoLocation)]);
}
