import { type queue } from '@bot/constants';
import type Bull from 'bullmq';
import { storageModel } from 'mongo';
import {
    deleteFile,
    download,
    execute,
    exists,
    getSizeBytes,
    makeDir,
    readFileAsStream,
    sha1hash,
    writeFile
} from '@bot/utils';
import path from 'path';
import { s3Storage } from 'storage';
import { env } from 'env';
import { DanserSettings } from 'utils';

/**
 * Run the Danser executable with the given options to process a replay into a video.
 * Downloads the replay file from the database and saves it to a temporary location before running Danser.
 */
export async function render(job: Bull.Job<queue.RecordJob>): Promise<void> {
    try {
        // Replay file should be small enough to download and process in memory
        const replayFile = await download(new URL(job.data.replayDownloadUrl));

        if (!replayFile.byteLength) {
            throw new Error(`Unable to download replay from Discord CDN.`);
        }

        const danserSettings = new DanserSettings();

        const replaysTempDir = danserSettings.osuReplaysDir;
        const videosTempDir = danserSettings.recordingOutputDir;

        const replaysTempDirExists = await exists(replaysTempDir);
        const videosTempDirExists = await exists(videosTempDir);

        if (!replaysTempDirExists) {
            await makeDir(replaysTempDir, { recursive: true });
        }

        if (!videosTempDirExists) {
            await makeDir(videosTempDir, { recursive: true });
        }

        const replayFileLocation = path.resolve(replaysTempDir, `${job.data.friendlyName}.osr`);
        const replayVideoLocation = path.resolve(videosTempDir, `${job.data.friendlyName}.mp4`);

        await writeFile(replayFileLocation, replayFile);

        job.updateProgress(10);

        await danserSettings.patch();

        await execute(env.DANSER_EXECUTABLE_PATH, [
            `--replay=${replayFileLocation}`,
            `--out=${job.data.friendlyName}`,
            ...job.data.danserOptions
        ]);

        job.updateProgress(80);

        console.info('Finished rendering video! 📽️');

        const videoHash = await sha1hash(readFileAsStream(replayVideoLocation));
        const s3Filename = `${videoHash}.mp4`;
        const videoFileSize = await getSizeBytes(replayVideoLocation);

        console.info(`Uploading ${replayVideoLocation} as ${s3Filename} to object storage...`);

        await s3Storage.upload({
            filename: s3Filename,
            body: readFileAsStream(replayVideoLocation),
            acl: 'public-read'
        });

        console.info(`Uploaded ${replayVideoLocation} as ${s3Filename} to object storage!`);

        job.updateProgress(90);

        await Promise.all([deleteFile(replayFileLocation), deleteFile(replayVideoLocation)]);

        const fileDownloadUrl = new URL(s3Storage.endpoint);

        fileDownloadUrl.pathname = `/${env.S3_BUCKET_NAME}/${s3Filename}`;

        await storageModel.findOneAndDelete({ sha1hash: videoHash });

        await storageModel.create({
            url: fileDownloadUrl.toString(),
            name: `${job.data.friendlyName}.mp4`,
            type: 'mp4',
            size: videoFileSize,
            sha1Hash: videoHash,
            discordOwnerId: job.data.discordUserId
        });

        job.updateProgress(100);
    } catch (error) {
        // BullMQ will automatically retry the job if an error is thrown
        // But, it does not log the error by default it seems so we should log it here
        console.error('Error processing job:', error);

        throw error;
    }
}
