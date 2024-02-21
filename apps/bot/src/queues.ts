import { KEYS, type RecordJob } from '@bot/queue';
import { env } from './env';
import { Queue } from 'bullmq';

// Redis client for KeyDB, KeyDB is a high-performance fork of Redis but Redis libs are compatible with KeyDB (to an extent)
/**
 * Queue for processing Osu! replay files ready for delegation to the Danser processe(s).
 */
export const recordReplayQueue = new Queue<RecordJob>(KEYS.RECORD, {
    connection: {
        host: env.KEYDB_URI.hostname,
        port: +env.KEYDB_URI.port
    }
});
