import { type CreateFastifyContextOptions } from '@trpc/server/adapters/fastify';
import { type discordUserSchema, getDiscordUserByToken } from 'utils/getDiscordUserByToken.js';
import { type z } from 'zod';

// Return type is hugely complex and is best avoided here
// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export async function createContext({ req, res }: CreateFastifyContextOptions) {
    return {
        req,
        res,
        async fetchDiscordUser(): Promise<z.infer<typeof discordUserSchema> | null> {
            const discordAccessToken = req.headers.cookie
                ?.match(/(?<=discordAccessToken=)[a-zA-Z0-9]*/)
                ?.at(0);

            if (!discordAccessToken) {
                return null;
            }

            const userResult = await getDiscordUserByToken(discordAccessToken);

            if (userResult.authenticated) {
                return userResult;
            }

            return null;
        }
    };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
