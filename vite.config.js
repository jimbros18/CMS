import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'node:os';

function getBackendIp() {
    const interfaces = os.networkInterfaces();
    const candidates = [];

    for (const name of Object.keys(interfaces)) {
        for (const net of interfaces[name] || []) {
            if (net.family === 'IPv4' && !net.internal) {
                candidates.push({ name, address: net.address });
            }
        }
    }

    console.log('[vite] Available IPv4 interfaces:', candidates);

    // Prefer a real LAN address, skip virtual adapters
    const virtualHints =
        /docker|wsl|vethernet|virtualbox|vmware|tailscale|zerotier|wireguard|loopback/i;

    const lan = candidates.find(
        (c) => !virtualHints.test(c.name) && c.address.startsWith('192.168.'),
    );

    return (lan || candidates[0])?.address || '127.0.0.1';
}

const BACKEND_IP = getBackendIp();
const BACKEND_PORT = 9000;

console.log(`[vite] Proxying /api -> http://${BACKEND_IP}:${BACKEND_PORT}`);

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            '/api': {
                target: `http://${BACKEND_IP}:${BACKEND_PORT}`,
                changeOrigin: true,
                rewrite: (path) => path.replace(/^\/api/, ''),
            },
        },
    },
});
