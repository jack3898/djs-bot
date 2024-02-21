import { type RecordJob, KEYS } from '@bot/queue';
import { Worker } from 'bullmq';
import { env } from 'env';
import { runDanserJob } from 'jobs';

export const recordReplayQueueWorker = new Worker<RecordJob>(
    KEYS.RECORD,
    (job) => {
        console.log(`Processing job ${job.id}`);

        return runDanserJob(job);
    },
    {
        connection: {
            host: env.KEYDB_URI.hostname,
            port: +env.KEYDB_URI.port
        }
    }
);

recordReplayQueueWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});
