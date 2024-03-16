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

export async function fetchDiscordUser(
    cookie: string
): Promise<z.infer<typeof discordUserSchema> | null> {
    const discordAccessToken = cookie?.match(/(?<=discordAccessToken=)[a-zA-Z0-9]*/)?.at(0);

    if (!discordAccessToken) {
        return null;
    }

    const userResult = await getDiscordUserByToken(discordAccessToken);

    if (userResult.authenticated) {
        return userResult;
    }

    return null;
}
