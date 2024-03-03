import { type TrpcRouter } from '@bot/api/dist/trpcRouter.js';
import { createTRPCReact } from '@trpc/react-query';

export const trpcReact = createTRPCReact<TrpcRouter>();
