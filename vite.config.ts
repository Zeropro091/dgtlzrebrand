import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import {defineConfig} from 'vite';

export default defineConfig(() => {
  return {
    plugins: [react(), tailwindcss()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:4000',
          changeOrigin: true,
        },
      },
          // HMR is disabled in AI Studio via DISABLE_HMR env var.
          // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
          hmr: process.env.DISABLE_HMR !== 'true',
          // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
          watch: process.env.DISABLE_HMR === 'true'
            ? null
            : {
                // CRITICAL FIX: backend menulis db.json + server.log di dalam folder project.
                // Tanpa ignore ini, tiap tulisan DB memicu full page reload (dashboard refresh terus).
                ignored: [
                  '**/server/**',
                  '**/server.log',
                  '**/dev-server.log',
                  '**/node_modules/**',
                  '**/.git/**',
                ],
              },
          // Allow access via ngrok public tunnel(s).
          allowedHosts: [
            'agriculturally-uncambered-ngoc.ngrok-free.dev',
            '.ngrok-free.app',
            '.ngrok.app',
            '.ngrok.io',
            '.ngrok.com',
          ],
        },
  };
});
