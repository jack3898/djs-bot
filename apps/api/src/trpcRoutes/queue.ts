import { TRPCError } from '@trpc/server';
import { recordReplayQueue } from 'queues.js';
import { trpc } from 'trpc.js';
import { z } from 'zod';

export const queueRouter = trpc.router({
    queue: trpc.procedure
        .input(z.object({ jobId: z.string() }))
        .output(z.object({ progress: z.string(), status: z.string() }))
        .query(async ({ input }) => {
            const job = await recordReplayQueue.getJob(input.jobId);

            if (!job) {
                throw new TRPCError({
                    code: 'NOT_FOUND',
                    message: 'Job not found'
                });
            }

            const jobState = await job.getState();

            return {
                progress: job.progress.toString(),
                status: jobState.toString()
            };
        })
});
