import { trpc } from 'trpc.js';
import { discordRouter, filesRouter, jobsRouter } from 'trpcRoutes/index.js';

export const trpcRouter = trpc.mergeRouters(jobsRouter, discordRouter, filesRouter);

// For client-side import
export type TrpcRouter = typeof trpcRouter;
