export type ReplayQueueJob = {
    executable: string;
    replayId: string;
    videoId: string;
    danserOptions: (`--settings=${string}` | `--quickstart`)[];
};
