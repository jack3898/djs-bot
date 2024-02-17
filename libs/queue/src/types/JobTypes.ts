export type ReplayQueueJob = {
    executable: string;
    replayId: string;
    danserOptions: (`--out=${string}` | `--settings=${string}` | `--quickstart`)[];
};
