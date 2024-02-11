import { z } from 'zod';

const envSchema = z.object({
    DISCORD_TOKEN: z
        .string()
        .min(1)
        .describe('The token of the bot. You can find this in the Discord Developer Portal.'),
    NODE_ENV: z
        .enum(['development', 'production'])
        .describe(
            'The environment the bot is running in. This should be set to "production" in production or "development" in development.'
        ),
    CLIENT_ID: z
        .string()
        .min(1)
        .describe('The ID of the bot. You can find this in the Discord Developer Portal.'),
    GUILD_ID: z
        .string()
        .min(1)
        .optional()
        .describe(
            'The ID of the guild to register commands in. This is only required in production.'
        )
});

export type Env = z.infer<typeof envSchema>;

export const env = envSchema.parse(process.env);
