import { type RecordJob } from '@bot/queue';
import type Bull from 'bullmq';
import { storageModel } from 'mongo';
import {
    deleteFile,
    download,
    execute,
    exists,
    fromMonorepoRoot,
    getSizeBytes,
    makeDir,
    readFileAsStream,
    sha1hash,
    writeFile
} from '@bot/utils';
import path from 'path';
import { s3Storage } from 'storage';

/**
 * Run the Danser executable with the given options to process a replay into a video.
 * Downloads the replay file from the database and saves it to a temporary location before running Danser.
 */
export async function runDanserJob(job: Bull.Job<RecordJob>): Promise<void> {
    // Replay file should be small enough to download and process in memory
    const replayFile = await download(new URL(job.data.replayDownloadUrl));

    if (!replayFile.byteLength) {
        throw new Error(`Unable to download replay from Discord CDN.`);
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

    const replayFileLocation = path.resolve(replaysTempDir, `${job.data.friendlyName}.osr`);
    const replayVideoLocation = path.resolve(videosTempDir, `${job.data.friendlyName}.mp4`);

    await writeFile(replayFileLocation, replayFile);

    await execute(job.data.executable, [
        `--replay=${replayFileLocation}`,
        `--out=${job.data.friendlyName}`,
        ...job.data.danserOptions
    ]);

    console.info('Finished rendering video! 📽️');

    const videoHash = await sha1hash(readFileAsStream(replayVideoLocation));
    const s3Filename = `${videoHash}.mp4`;
    const videoFileSize = await getSizeBytes(replayVideoLocation);

    console.info(`Uploading ${replayVideoLocation} as ${s3Filename} to object storage...`);

    await s3Storage.upload({
        filename: s3Filename,
        body: readFileAsStream(replayVideoLocation)
    });

    console.info(`Uploaded ${replayVideoLocation} as ${s3Filename} to object storage!`);

    await Promise.all([deleteFile(replayFileLocation), deleteFile(replayVideoLocation)]);

    const fileDownloadUrl = new URL(s3Storage.endpoint);

    fileDownloadUrl.pathname = `/${s3Filename}`;

    await storageModel.create({
        url: fileDownloadUrl.toString(),
        name: `${job.data.friendlyName}.mp4`,
        type: 'mp4',
        size: videoFileSize,
        sha1Hash: videoHash,
        discordOwnerId: job.data.discordUserId
    });
}
