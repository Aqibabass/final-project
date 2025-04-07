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
  },
  define: {
    'import.meta.env.RAZORPAY_KEY_ID': JSON.stringify(process.env.RAZORPAY_KEY_ID),
    'import.meta.env.RAZORPAY_KEY_SECRET': JSON.stringify(process.env.RAZORPAY_KEY_SECRET)
  }
});
