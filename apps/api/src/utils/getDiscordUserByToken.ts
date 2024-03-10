import { z } from 'zod';

export const discordUserSchema = z.object({
    authenticated: z.literal(true).default(true),
    id: z.string(),
    username: z.string(),
    avatar: z.string(),
    discriminator: z.string()
});

export const discordUserUnauthorisedSchema = z.object({
    authenticated: z.literal(false).default(false),
    message: z.string(),
    code: z.number()
});

export const discordUserFetchResponseSchema = z.union([
    discordUserSchema,
    discordUserUnauthorisedSchema
]);

export async function getDiscordUserByToken(
    token: string
): Promise<z.infer<typeof discordUserFetchResponseSchema>> {
    const userResult = await fetch('https://discord.com/api/users/@me', {
        headers: {
            authorization: `Bearer ${token}`
        }
    });

    return discordUserFetchResponseSchema.parse(await userResult.json());
}
