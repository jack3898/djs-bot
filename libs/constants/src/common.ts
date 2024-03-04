import { Bytes } from '@bot/utils';

type Tier = {
    free: unknown;
    premium: unknown;
    admin: unknown;
};

export const storageLimits = {
    quantityByTier: {
        free: 5,
        premium: 30,
        admin: Infinity
    } satisfies Tier,
    // This is a very loose approximation of the file size limits
    // Users can game the system by uploading a file that is just under the limit
    // But that's fine by me, I don't want to spend too much time on this.
    replayFilesizeByTier: {
        free: Bytes.fromKB(500), // Roughly 20+ minute replay
        premium: Bytes.fromMB(1), // Roughly 40+ minute replay
        admin: Infinity
    } satisfies Tier
} as const;
