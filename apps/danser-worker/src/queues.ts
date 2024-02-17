import { createRecordReplayQueue } from '@bot/queue';
import { env } from 'env';

export const recordReplayQueue = createRecordReplayQueue({
    redis: {
        host: env.KEYDB_URI.hostname,
        port: +env.KEYDB_URI.port
    }
});

recordReplayQueue.on('failed', (job, err) => {
    console.error('Job failed:', job.id, err);
});

recordReplayQueue.on('error', (error) => {
    console.error('An error occurred:', error);
});
