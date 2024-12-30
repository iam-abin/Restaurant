import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), svgr()],
    server: {
        port: 5000, // Change the port number here
    },
    build: {
        outDir: 'build',
    },
});
