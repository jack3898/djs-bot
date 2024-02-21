import { type S3Client, PutObjectCommand, type PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { type ReadStream } from 'fs';

export function uploadToObjectStorage(
    s3Client: S3Client,
    bucketName: string,
    filename: string,
    body: Buffer | ReadStream
): Promise<PutObjectCommandOutput> {
    return s3Client.send(
        new PutObjectCommand({
            Bucket: bucketName,
            Key: filename,
            Body: body
        })
    );
}
