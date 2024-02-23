import { spawn } from 'child_process';

export function execute(file: string, args: string[]): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        const process = spawn(file, args);

        process.stdout.on('data', (data) => {
            console.log(data.toString());
        });

        process.stderr.on('data', (data) => {
            console.error(data.toString());
        });

        process.on('close', (code) => {
            if (code === 0) {
                resolve();
            }

            reject(new Error(`Process ${file} exited with code ${code}`));
        });
    });
}
