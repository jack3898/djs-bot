import { type ReadStream } from 'fs';
import { createHash } from 'crypto';

type Algorithm = 'sha1' | 'md5';

export function hashBuffer(file: Buffer, algorithm: Algorithm = 'sha1'): string {
    const hash = createHash(algorithm);

    return hash.update(file).digest('hex');
}

export function hashStream(file: ReadStream, algorithm: Algorithm = 'sha1'): Promise<string> {
    const hash = createHash(algorithm);

    return new Promise((resolve, reject) => {
        file.on('data', (chunk) => {
            hash.update(chunk);
        });

        file.on('end', () => {
            resolve(hash.digest('hex'));
        });

        file.on('error', (err) => {
            reject(err);
        });
    });
}

export function hash(file: ReadStream | Buffer, algorithm: Algorithm = 'sha1'): Promise<string> {
    if (file instanceof Buffer) {
        return Promise.resolve(hashBuffer(file, algorithm));
    }

    // File is a read stream, so we need to pipe it to the hash instead
    return hashStream(file, algorithm);
}
