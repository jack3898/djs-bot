import { fastifyTRPCPlugin, type FastifyTRPCPluginOptions } from '@trpc/server/adapters/fastify';
import { fastify } from 'server.js';
import { createContext } from 'context.js';
import { type TrpcRouter, trpcRouter } from 'trpcRouter.js';

fastify.register(fastifyTRPCPlugin, {
    prefix: '/trpc',
    trpcOptions: {
        router: trpcRouter,
        createContext,
        onError({ path, error }): void {
            // report to error monitoring
            console.error(`Error in tRPC handler on path '${path}':`, error);
        }
    } satisfies FastifyTRPCPluginOptions<TrpcRouter>['trpcOptions']
});
