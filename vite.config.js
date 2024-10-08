import 'dotenv/config';
import { defineConfig } from 'vite';
import CloudflarePagesFunctions from 'vite-plugin-cloudflare-functions';

export default defineConfig({
    root: 'src',
    build: {
        outDir: '../dist',
        rollupOptions: {
            input: {
                index: 'src/index.html',
                demoads: 'src/demoads.html',
                demoadblocking: 'src/demoadblocking.html',
            },
        },
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
                    API_TOKEN: process.env.API_TOKEN,
                },
            }
        })
    ]
});