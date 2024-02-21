import { z } from 'zod';
import { getEnv } from '@bot/utils';

const envSchema = z.object({
    DISCORD_TOKEN: z.string().min(1, 'Discord token must be defined to authenticate the bot.'),
    NODE_ENV: z.enum(['development', 'production']),
    CLIENT_ID: z.string().min(1, 'Client ID must be defined to register slash commands.'),
    GUILD_ID: z.string().optional(),
    DANSER_EXECUTABLE_PATH: z
        .string()
        .min(1, 'Danser executable path must be defined to generate replays.'),
    DANSER_CONFIG_NAME: z
        .string()
        .min(1, 'Danser config path must be defined to generate replays.'),
    MONGO_URI: z
        .string()
        .url()
        .transform((url) => new URL(url)),
    KEYDB_URI: z
        .string()
        .url()
        .transform((url) => new URL(url)),
    S3_DOMAIN: z.string(),
    S3_REGION: z.string(),
    S3_BUCKET_NAME: z.string()
});

export const env = await getEnv(envSchema);

console.info('NODE_ENV =', env.NODE_ENV);
console.info('CLIENT_ID =', env.CLIENT_ID);
console.info('GUILD_ID =', env.GUILD_ID);
console.info('DANSER_EXECUTABLE_PATH =', env.DANSER_EXECUTABLE_PATH);
console.info('DANSER_CONFIG_NAME =', env.DANSER_CONFIG_NAME);
