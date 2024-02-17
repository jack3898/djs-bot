export type ReplayQueueJob = {
    executable: string;
    replayId: string;
    videoId: string;
    danserOptions: (`--out=${string}` | `--settings=${string}` | `--quickstart`)[];
};
