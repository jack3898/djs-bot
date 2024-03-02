import https from 'https';
import fs from 'fs';

export async function download(url: URL): Promise<Buffer> {
    const chunks: Uint8Array[] = [];

    return new Promise((resolve, reject) => {
        https.get(url, (response) => {
            response.on('data', (chunk: Uint8Array) => {
                chunks.push(chunk);
            });

            response.on('end', () => {
                const buffer = Buffer.concat(chunks);
                resolve(buffer);
            });

            response.on('error', (error) => {
                reject(error);
            });
        });
    });
}

export async function downloadToDisk(url: URL, path: string): Promise<void> {
    return new Promise((resolve, reject) => {
        const file = fs.createWriteStream(path);

        https.get(url, (response) => {
            response.pipe(file);

            file.on('finish', () => {
                file.close();
                resolve();
            });

            file.on('error', (error) => {
                reject(error);
            });
        });
    });
}
