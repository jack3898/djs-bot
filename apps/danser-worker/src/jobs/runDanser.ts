import { type ReplayQueueJob } from '@bot/queue';
import type Bull from 'bull';
import { execFile } from 'child_process';
import { replaysModel } from 'mongo';
import { deleteFile, exists, fromMonorepoRoot, makeDir, writeFile } from '@bot/utils';
import path from 'path';

/**
 * Run the Danser executable with the given options to process a replay into a video.
 * Downloads the replay file from the database and saves it to a temporary location before running Danser.
 */
export async function runDanserJob(job: Bull.Job<ReplayQueueJob>): Promise<void> {
    console.log('Processing job:', job.data);

    const file = await replaysModel.findById(job.data.replayId);

    if (!file) {
        throw new Error(`Replay with id ${job.data.replayId} not found`);
    }

    const replaysTempDir = fromMonorepoRoot('.data', 'replays');
    const replayTempDirExists = await exists(replaysTempDir);

    if (!replayTempDirExists) {
        await makeDir(replaysTempDir, { recursive: true });
    }

    const replayFileLocation = path.resolve(replaysTempDir, `${job.data.replayId}.osr`);

    await writeFile(replayFileLocation, file.buffer);

    return new Promise((resolve, reject) => {
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
                deleteFile(replayFileLocation);

                resolve();
            }

            reject(new Error(`Danser exited with code ${code}`));
        });
    });
}
