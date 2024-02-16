import { execFile } from 'child_process';

export type DanserOptions =
    | `--out=${string}`
    | `--settings=${string}`
    | `--replay=${string}`
    | `--quickstart`;

export function runDanser(executable: string, options: DanserOptions[]): Promise<void> {
    return new Promise((resolve, reject) => {
        execFile(executable, options, (error, stdout, stderr) => {
            if (error) {
                throw error;
            }

            if (stdout) {
                console.log(stdout);
            }

            if (stderr) {
                console.error(stderr);
            }
        }).on('exit', (code) => {
            if (code === 0) {
                resolve();
            }

            reject(new Error(`Danser exited with code ${code}`));
        });
    });
}
