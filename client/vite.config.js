import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 5173,
    strictPort: true, 
    proxy: {
      '/api': process.env.VITE_BASE_URL ||'http://localhost:4000',
    },
  },
  plugins: [react()]
});
  