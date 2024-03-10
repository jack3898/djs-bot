import { trpc } from 'trpc.js';
import { z } from 'zod';

const discordUserSchema = z.object({
    authenticated: z.literal(true).default(true),
    id: z.string(),
    username: z.string(),
    avatar: z.string(),
    discriminator: z.string()
});

const discordUserUnauthorisedSchema = z.object({
    authenticated: z.literal(false).default(false),
    message: z.string(),
    code: z.number()
});

const expectedResponse = z.union([discordUserSchema, discordUserUnauthorisedSchema]);

// For AUTH related routes, please refer to the vanilla fastify implementation
// TRPC is better for JSON API routes

export const discordRouter = trpc.router({
    me: trpc.procedure.output(expectedResponse).query(async ({ ctx }) => {
        const userResult = await fetch('https://discord.com/api/users/@me', {
            headers: {
                authorization: `Bearer ${ctx.discordAccessToken}`
            }
        });

        return userResult.json();
    })
});
