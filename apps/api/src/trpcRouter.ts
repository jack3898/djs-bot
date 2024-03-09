import { trpc } from 'trpc.js';
import { queueRouter } from 'trpcRoutes/index.js';

export const trpcRouter = trpc.mergeRouters(queueRouter);

// For client-side import
export type TrpcRouter = typeof trpcRouter;
