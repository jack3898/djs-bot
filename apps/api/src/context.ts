import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';

// Return type is hugely complex and is best avoided here
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function createContext({ req, res }: CreateFastifyContextOptions) {
    const discordAccessToken = req.headers.cookie
        ?.match(/(?<=discordAccessToken=)[a-zA-Z0-9]*/)
        ?.at(0);

    return { req, res, discordAccessToken };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
