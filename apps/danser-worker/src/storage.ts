import { S3Client } from '@aws-sdk/client-s3';
import { env } from './env';

export const s3Client = new S3Client({
    region: env.S3_REGION,
    endpoint: new URL(`https://${env.S3_REGION}.${env.S3_DOMAIN}`).toString(),
    forcePathStyle: false,
    credentials: {
        accessKeyId: env.S3_ACCESS_KEY_ID,
        secretAccessKey: env.S3_SECRET_ACCESS_KEY
    }
});
