import { defineConfig } from 'vite';

import CloudflarePagesFunctions from 'vite-plugin-cloudflare-functions';

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
    },
    plugins: [
        CloudflarePagesFunctions({
            root: 'functions',
            outDir: '../dist',
            dts: false,
            wrangler: {
                log: true,
                compatibilityDate: '2024-10-08',
                binding: {
                    API_TOKEN: 'atata',
                },
            }
        })
    ]
});