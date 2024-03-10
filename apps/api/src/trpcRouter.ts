import { trpc } from 'trpc.js';
import { discordRouter, filesRouter, queueRouter } from 'trpcRoutes/index.js';

export const trpcRouter = trpc.mergeRouters(queueRouter, discordRouter, filesRouter);

// For client-side import
export type TrpcRouter = typeof trpcRouter;
