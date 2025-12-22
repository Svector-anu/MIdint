import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
    plugins: [
        react(),
        nodePolyfills({
            // Enable polyfills for specific globals and modules
            globals: {
                Buffer: true,
                process: true,
            },
        }),
    ],
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
    define: {
        global: 'globalThis',
    },
})
