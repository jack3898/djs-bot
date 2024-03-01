import jwt from 'jsonwebtoken';
import { type z, type ZodTypeAny } from 'zod';

export class JWT<T extends ZodTypeAny> {
    #secret: string;
    schema: T;

    constructor(secret: string, schema: T) {
        this.#secret = secret;
        this.schema = schema;
    }

    async sign(data: z.infer<T>, options?: jwt.SignOptions): Promise<string> {
        const verifiedData = await this.schema.safeParseAsync(data);

        if (!verifiedData.success) {
            throw new JWTError('Invalid token data.');
        }

        return jwt.sign(verifiedData.data, this.#secret, options);
    }

    async verify(token: string, options?: jwt.VerifyOptions): Promise<z.infer<T>> {
        const verifiedToken = await new Promise((resolve, reject) => {
            jwt.verify(token, this.#secret, options, (error: unknown, decoded: unknown) => {
                if (error) {
                    reject(new JWTError('Invalid token provided.'));
                } else {
                    resolve(decoded);
                }
            });
        });

        const verifiedData = await this.schema.safeParseAsync(verifiedToken);

        if (!verifiedData.success) {
            throw new JWTError('Invalid token data.');
        }

        return verifiedData.data;
    }
}

export class JWTError extends Error {
    constructor(public message: string) {
        super();
        this.message = message;
    }
}
