import { type ZodTypeAny, type z } from 'zod';

export function getEnvBySchema<T extends ZodTypeAny>(schema: T): Promise<z.infer<T>> {
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
