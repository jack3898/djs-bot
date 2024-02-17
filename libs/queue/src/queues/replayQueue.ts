import Queue, { type QueueOptions, type Queue as QueueInstance } from 'bull';
import { type ReplayQueueJob } from 'types';

export function createRecordReplayQueue(queueOptions: QueueOptions): QueueInstance<ReplayQueueJob> {
    return new Queue('replay-add', queueOptions);
}
