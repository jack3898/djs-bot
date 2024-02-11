import { z } from 'zod';

const envSchema = z.object({
    DISCORD_TOKEN: z.string().min(1, 'Discord token must be defined to authenticate the bot.'),
    NODE_ENV: z.enum(['development', 'production']),
    CLIENT_ID: z.string().min(1, 'Client ID must be defined to register slash commands.'),
    GUILD_ID: z.string().optional()
});

export type Env = z.infer<typeof envSchema>;

export const env = await envSchema.safeParseAsync(process.env).then((result) => {
    if (!result.success) {
        console.error(
            result.error.errors
                .map((error) => `Invalid ${error.path} in environment. ${error.message}`)
                .join('\n')
        );

        process.exit(1);
    }

    // I could loop through the keys, but that will risk exposing sensitive information like tokens.
    console.info('NODE_ENV =', result.data.NODE_ENV);
    console.info('CLIENT_ID =', result.data.CLIENT_ID);
    console.info('GUILD_ID =', result.data.GUILD_ID);

    return result.data;
});
