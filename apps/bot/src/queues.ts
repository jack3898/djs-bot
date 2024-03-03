import { queue } from '@bot/constants';
import { env } from './env';
import { Queue } from 'bullmq';

const connection = {
    host: env.KEYDB_URI.hostname,
    port: +env.KEYDB_URI.port
};

// Redis client for KeyDB, KeyDB is a high-performance fork of Redis but Redis libs are compatible with KeyDB (to an extent)
/**
 * Queue for processing Osu! replay files ready for delegation to the Danser processe(s).
 */
export const recordReplayQueue = new Queue<queue.RecordJob>(queue.QUEUE_KEYS.RECORD, {
    connection
});
