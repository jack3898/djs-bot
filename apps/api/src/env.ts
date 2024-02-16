import { z } from 'zod';
import { getEnv } from '@bot/utils';

const envSchema = z.object({
    MONGO_URI: z.string().min(1, 'Mongo URI must be defined to connect to the database.')
});

export const env = await getEnv(envSchema);
