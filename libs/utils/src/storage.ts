import {
    ObjectCannedACL,
    PutObjectCommand,
    type PutObjectCommandOutput,
    S3Client,
    GetObjectCommand,
    type GetObjectCommandOutput
} from '@aws-sdk/client-s3';
import { type ReadStream } from 'fs';

export class S3Storage {
    readonly client: S3Client;
    readonly region: string;
    readonly endpoint: URL;
    readonly bucketName: string;

    constructor(options: {
        region: string;
        domain: string;
        accessKeyId: string;
        secretAccessKey: string;
        bucketName: string;
    }) {
        const { region, domain, accessKeyId, secretAccessKey, bucketName } = options;

        this.endpoint = new URL(`https://${region}.${domain}`);

        this.client = new S3Client({
            region: region,
            endpoint: this.endpoint.toString(),
            forcePathStyle: false,
            credentials: {
                accessKeyId: accessKeyId,
                secretAccessKey: secretAccessKey
            }
        });

        this.region = region;
        this.bucketName = bucketName;
    }

    upload(options: {
        filename: string;
        body: Buffer | ReadStream;
        acl?: ObjectCannedACL;
    }): Promise<PutObjectCommandOutput> {
        const { filename, body, acl = ObjectCannedACL.public_read } = options;

        const putObjectCommand = new PutObjectCommand({
            Bucket: this.bucketName,
            Key: filename,
            Body: body,
            ACL: acl
        });

        return this.client.send(putObjectCommand);
    }

    download(filename: string): Promise<GetObjectCommandOutput> {
        return this.client.send(
            new GetObjectCommand({
                Bucket: this.bucketName,
                Key: filename
            })
        );
    }
}
