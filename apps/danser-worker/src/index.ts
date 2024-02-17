import { recordReplayQueue } from './queues';
import * as jobs from './jobs';

recordReplayQueue.process(jobs.runDanserJob);
