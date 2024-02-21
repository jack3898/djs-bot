import { z } from 'zod';
import { getEnv } from '@bot/utils';

const envSchema = z.object({
    MONGO_URI: z.string().min(1, 'Mongo URI must be defined to connect to the database.'),
    KEYDB_URI: z
        .string()
        .url()
        .transform((url) => new URL(url)),
    S3_DOMAIN: z.string(),
    S3_REGION: z.string(),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_BUCKET_NAME: z.string()
});

export const env = await getEnv(envSchema);
