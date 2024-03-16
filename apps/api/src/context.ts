import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { fetchDiscordUser } from 'utils/getDiscordUserByToken.js';

// Return type is hugely complex and is best avoided here
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function createContext({ req, res }: CreateFastifyContextOptions) {
    return {
        req,
        res,
        // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
        fetchDiscordUser: () => fetchDiscordUser(req.headers.cookie || '')
    };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
