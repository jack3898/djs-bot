import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

// Return type is hugely complex and is best avoided here
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContext({ req, res }: CreateFastifyContextOptions) {
    const user = { name: req.headers.username ?? 'anonymous' };

    return { req, res, user };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
