export const QUEUE_KEYS = {
    RECORD: 'RECORD'
} as const;

export type RecordJob = {
    replayDownloadUrl: string;
    friendlyName: string;
    discordUserId: string;
    danserOptions: (`--settings=${string}` | `--quickstart`)[];
};

export type KeyType = (typeof QUEUE_KEYS)[keyof typeof QUEUE_KEYS];

export type KeysObject = typeof QUEUE_KEYS;
