import { TRPCError } from '@trpc/server';
import { jobsModel } from 'mongo.js';
import { recordReplayQueue } from 'queues.js';
import { trpc } from 'trpc.js';
import { z } from 'zod';

export const jobsRouter = trpc.router({
    job: trpc.procedure
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
        }),
    jobs: trpc.procedure
        .output(
            z.array(
                z.object({
                    id: z.string(),
                    jobId: z.number(),
                    status: z.enum(['waiting', 'completed', 'failed', 'active'])
                })
            )
        )
        .query(async ({ ctx }) => {
            const discordUser = await ctx.fetchDiscordUser();

            if (!discordUser) {
                throw new TRPCError({
                    code: 'UNAUTHORIZED',
                    message: 'Unauthorized'
                });
            }

            const jobs = await jobsModel
                .find({
                    discordId: discordUser.id
                })
                .limit(10)
                .sort({ createdAt: -1 });

            return jobs.map((job) => job.toObject({ virtuals: true }));
        })
});
