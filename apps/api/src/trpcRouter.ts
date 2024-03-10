import { trpc } from 'trpc.js';
import { discordRouter, queueRouter } from 'trpcRoutes/index.js';

export const trpcRouter = trpc.mergeRouters(queueRouter, discordRouter);

// For client-side import
export type TrpcRouter = typeof trpcRouter;
