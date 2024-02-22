import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import { promisify } from 'util';
import fs from 'fs';

export const writeFile = promisify(fs.writeFile);
export const deleteFile = promisify(fs.unlink);
export const readFile = promisify(fs.readFile);
export const exists = promisify(fs.exists);
export const makeDir = promisify(fs.mkdir);
export const readFileAsStream = fs.createReadStream;
export const stat = promisify(fs.stat);

const thisFile = fileURLToPath(import.meta.url);
const thisDir = dirname(thisFile);
const monorepoRoot = path.resolve(thisDir, '..', '..', '..');

export function fromMonorepoRoot(...repo_path: string[]): string {
    return path.resolve(monorepoRoot, ...repo_path);
}

/**
 * Get the size of a file in bytes using a file path.
 */
export async function getSizeBytes(filePath: string): Promise<number | null> {
    const fileExists = await exists(filePath);

    if (!fileExists) {
        return null;
    }

    return stat(filePath).then((stats) => stats.size);
}
