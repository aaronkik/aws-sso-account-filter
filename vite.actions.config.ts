import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'node:path';
import { defineConfig } from 'vite';

const srcDir = resolve(__dirname, 'src');

export default defineConfig({
  build: {
    cssMinify: false,
    minify: false,
    rollupOptions: {
      input: {
        popup: resolve(srcDir, 'popup/index.html'),
      },
    },
  },
  plugins: [tailwindcss(), react()],
});
