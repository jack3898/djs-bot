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

function toUrl(strUrl: string): URL {
    return new URL(strUrl);
}

// SCHEMAS

export const coreEnv = {
    DISCORD_TOKEN: z.string().min(1),
    NODE_ENV: z.enum(['development', 'production', 'test']),
    CLIENT_ID: z.string().min(1),
    GUILD_ID: z.string().optional()
};

export const danserEnv = {
    DANSER_EXECUTABLE_PATH: z.string().min(1),
    DANSER_CONFIG_NAME: z.string().min(1)
};

export const mongoEnv = {
    MONGO_URI: z.string().transform(toUrl)
};

export const keydbEnv = {
    KEYDB_URI: z.string().transform(toUrl)
};

export const s3Env = {
    S3_DOMAIN: z.string().min(1),
    S3_REGION: z.string().min(1),
    S3_ACCESS_KEY_ID: z.string().min(1),
    S3_SECRET_ACCESS_KEY: z.string().min(1),
    S3_BUCKET_NAME: z.string().min(1)
};

export const osuEnv = {
    OSU_CLIENT_ID: z.string().min(1),
    OSU_CLIENT_SECRET: z.string().min(1),
    OSU_REDIRECT_URI: z.string().transform(toUrl)
};
