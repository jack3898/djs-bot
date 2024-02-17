import { type ReplayQueueJob } from '@bot/queue';
import type Bull from 'bull';
import { execFile } from 'child_process';
import { filesModel } from 'mongo';
import { deleteFile, exists, fromMonorepoRoot, makeDir, readFile, writeFile } from '@bot/utils';
import path from 'path';
import { createHash } from 'crypto';

/**
 * Run the Danser executable with the given options to process a replay into a video.
 * Downloads the replay file from the database and saves it to a temporary location before running Danser.
 */
export async function runDanserJob(job: Bull.Job<ReplayQueueJob>): Promise<void> {
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
    const replayVideoLocation = path.resolve(videosTempDir, `${job.data.videoId}.mp4`);

    await writeFile(replayFileLocation, file.buffer);

    await new Promise<void>((resolve, reject) => {
        execFile(
            job.data.executable,
            [`--replay=${replayFileLocation}`, ...job.data.danserOptions],
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

    const video = await readFile(replayVideoLocation);
    const videoHash = createHash('sha256').update(video).digest('hex');

    await filesModel.create({
        _id: job.data.videoId,
        buffer: video,
        filename: `${job.data.videoId}.mp4`,
        filetype: 'mp4',
        shaHash: videoHash,
        ownerId: file.ownerId
    });

    await Promise.all([deleteFile(replayFileLocation), deleteFile(replayVideoLocation)]);
}
