    // vite.config.ts
    import { defineConfig } from 'vite';
    // @ts-ignore
    import path from 'path';
    import { fileURLToPath } from 'url';

    // @ts-ignore
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    export default defineConfig({
        publicDir: 'public',
        resolve: {
            alias: {
                "@": path.resolve(__dirname, "src"),
            },
        },

        css: {
            modules: false,
            postcss: './postcss.config.js',
        },
    });
