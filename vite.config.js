import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import os from 'os';

// Helper function to get the local IPv4 address
function getLocalIp() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (localhost) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address; // e.g., '10.0.2.88'
      }
    }
  }
  return '10.0.2.88'; // Fallback
}

// Get the IP and append the FastAPI port
const backendIp = getLocalIp();
const backendPort = 9000; 
const backendUrl = `http://${backendIp}:${backendPort}`;

console.log(`\n🔗 Vite Proxy targeting Backend at: ${backendUrl}\n`);

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allows other devices on the network to access Vite too
    proxy: {
      // Any request starting with /api will be forwarded to the backend
      '/api': {
        target: backendUrl,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, ''), // Removes /api before sending
      },
    },
  },
});