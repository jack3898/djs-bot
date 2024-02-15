import https from 'https';

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
