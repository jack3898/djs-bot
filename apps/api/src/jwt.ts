import { JWT } from '@bot/utils';
import { env } from './env';
import { z } from 'zod';

const osuOAuthStateDataSchema = z.object({
    discordId: z.string()
});

export const jwt = new JWT(env.JWT_SECRET, osuOAuthStateDataSchema);
