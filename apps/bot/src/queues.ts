import { createRecordReplayQueue } from '@bot/queue';
import { env } from './env';

// Redis client for KeyDB, KeyDB is a high-performance fork of Redis but Redis libs are compatible with KeyDB (to an extent)
/**
 * Queue for processing Osu! replay files ready for delegation to the Danser processe(s).
 */
export const recordReplayQueue = createRecordReplayQueue({
    redis: {
        host: env.KEYDB_URI.hostname,
        port: +env.KEYDB_URI.port
    }
});
