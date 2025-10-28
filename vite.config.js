import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import svgr from 'vite-plugin-svgr';

export default defineConfig({
  plugins: [react(), svgr()],
  define: {
    global: 'window',
  },
  plugins: [
    react(),
    svgr({ exportAsDefault: true }), // default import로 받으려면 이 옵션이 편함
  ],
  resolve: {
    alias: {
      '@': '/src',
      '@assets': '/src/assets',
    },
  },
});
