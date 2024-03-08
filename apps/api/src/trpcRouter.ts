import { trpc } from 'trpc.js';
import { queueRouter, configRouter } from 'trpcRoutes/index.js';

export const trpcRouter = trpc.mergeRouters(queueRouter, configRouter);

// For client-side import
export type TrpcRouter = typeof trpcRouter;
