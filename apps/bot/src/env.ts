import { z } from 'zod';
import { getEnv } from '@bot/utils';

const envSchema = z.object({
    DISCORD_TOKEN: z.string().min(1, 'Discord token must be defined to authenticate the bot.'),
    NODE_ENV: z.enum(['development', 'production']),
    CLIENT_ID: z.string().min(1, 'Client ID must be defined to register slash commands.'),
    GUILD_ID: z.string().optional()
});

export const env = await getEnv(envSchema);

console.info('NODE_ENV =', env.NODE_ENV);
console.info('CLIENT_ID =', env.CLIENT_ID);
console.info('GUILD_ID =', env.GUILD_ID);
