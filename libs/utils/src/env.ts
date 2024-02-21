import { type ZodTypeAny, z } from 'zod';

export function getEnv<T extends ZodTypeAny>(schema: T): Promise<z.infer<T>> {
    return schema.safeParseAsync(process.env).then((result) => {
        if (!result.success) {
            console.error(
                result.error.errors
                    .map((error) => `Invalid ${error.path} in environment. ${error.message}`)
                    .join('\n')
            );

            process.exit(1);
        }

        return result.data;
    });
}

// SCHEMAS

export const coreEnv = {
    DISCORD_TOKEN: z.string().min(1, 'Discord token must be defined to authenticate the bot.'),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    CLIENT_ID: z.string().min(1, 'Client ID must be defined to register slash commands.'),
    GUILD_ID: z.string().optional()
};

export const danserEnv = {
    DANSER_EXECUTABLE_PATH: z
        .string()
        .min(1, 'Danser executable path must be defined to generate replays.'),
    DANSER_CONFIG_NAME: z.string().min(1, 'Danser config path must be defined to generate replays.')
};

export const mongoEnv = {
    MONGO_URI: z.string().min(1, 'Mongo URI must be defined to connect to the database.')
};

export const keydbEnv = {
    KEYDB_URI: z
        .string()
        .url()
        .transform((url) => new URL(url))
};

export const s3Env = {
    S3_DOMAIN: z.string(),
    S3_REGION: z.string(),
    S3_ACCESS_KEY_ID: z.string(),
    S3_SECRET_ACCESS_KEY: z.string(),
    S3_BUCKET_NAME: z.string()
};
