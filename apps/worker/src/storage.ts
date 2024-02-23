import { env } from './env';
import { S3Storage } from '@bot/utils';

export const s3Storage = new S3Storage({
    region: env.S3_REGION,
    domain: env.S3_DOMAIN,
    accessKeyId: env.S3_ACCESS_KEY_ID,
    secretAccessKey: env.S3_SECRET_ACCESS_KEY,
    bucketName: env.S3_BUCKET_NAME
});
