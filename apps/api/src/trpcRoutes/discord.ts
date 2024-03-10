import { trpc } from 'trpc.js';
import { discordUserSchema } from 'utils/getDiscordUserByToken.js';
import { z } from 'zod';

// For AUTH related routes, please refer to the vanilla fastify implementation
// TRPC is better for JSON API routes

export const discordRouter = trpc.router({
    me: trpc.procedure.output(z.union([discordUserSchema, z.null()])).query(({ ctx }) => {
        return ctx.fetchDiscordUser();
    })
});
