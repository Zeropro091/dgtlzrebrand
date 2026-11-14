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
      // Bind all interfaces so the site is reachable from other devices on the
      // LAN and over Tailscale, not just from this machine.
      host: true,
      proxy: {
        '/api': {
          target: `http://localhost:${process.env.API_PORT || 4000}`,
          changeOrigin: true,
        },
      },
          // HMR is disabled in AI Studio via DISABLE_HMR env var.
          // Do not modify - file watching is disabled to prevent flickering during agent edits.
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
          // Allow access via ngrok / cloudflare tunnels and LAN+Tailscale devices.
          allowedHosts: [
            'agriculturally-uncambered-ngoc.ngrok-free.dev',
            '.ngrok-free.dev',
            '.ngrok-free.app',
            '.ngrok.app',
            '.ngrok.io',
            '.ngrok.com',
            // Cloudflare quick tunnels (cloudflared --url)
            '.trycloudflare.com',
            // Cloudflare Tunnel (dgtlz.my.id)
            'dgtlz.my.id',
            '.dgtlz.my.id',
            // Local network + Tailscale access from phones/tablets
            '192.168.93.177',
            '100.119.128.12',
          ],
        },
  };
});
