import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        sourcemap: true
    },
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src')
        }
    }
});
