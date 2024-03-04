import { queue, common } from '@bot/constants';
import { Worker } from 'bullmq';
import { env } from 'env.js';
import { render } from 'jobs/index.js';
import { storageModel } from 'mongo.js';

export const recordReplayQueueWorker = new Worker<queue.RecordJob>(
    queue.QUEUE_KEYS.RECORD,
    async (job): Promise<void> => {
        console.log(`Processing job ${job.id}\nJob details: ${JSON.stringify(job.data, null, 2)}`);

        const replayCountForUser = await storageModel.countDocuments({
            discordOwnerId: job.data.discordUserId,
            type: 'mp4'
        });

        if (replayCountForUser >= common.storageLimits.quantityByTier.free) {
            throw new Error(
                `User ${job.data.discordUserId} has reached their maximum replay limit.`
            );
        }

        return render(job);
    },
    {
        connection: {
            host: env.KEYDB_URI.hostname,
            port: +env.KEYDB_URI.port
        },
        removeOnFail: { count: 3 }
    }
);

recordReplayQueueWorker.on('active', (job) => {
    console.log(`Job ${job.id} active`);
});

recordReplayQueueWorker.on('error', (error) => {
    console.error('Error processing job:', error);
});

recordReplayQueueWorker.on('completed', (job) => {
    console.log(`Job ${job.id} completed`);
});
