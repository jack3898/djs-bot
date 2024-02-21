import { type ReadStream } from 'fs';
import { createHash } from 'crypto';

const algorithm = 'sha1';

export function sha1HashBuffer(file: Buffer): string {
    const sha1hash = createHash(algorithm);

    return sha1hash.update(file).digest('hex');
}

export function sha1HashStream(file: ReadStream): Promise<string> {
    const sha1hash = createHash(algorithm);

    return new Promise((resolve, reject) => {
        sha1hash.setEncoding('hex');

        file.pipe(sha1hash);

        file.on('end', () => {
            sha1hash.end();
            resolve(sha1hash.read());
        });

        file.on('error', (err) => {
            reject(err);
        });
    });
}

export function sha1hash(file: ReadStream | Buffer): Promise<string> {
    if (file instanceof Buffer) {
        return Promise.resolve(sha1HashBuffer(file));
    }

    // File is a read stream, so we need to pipe it to the hash instead
    return sha1HashStream(file);
}
