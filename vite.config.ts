import { fileURLToPath, URL } from 'node:url';

import ui from '@nuxt/ui/vite';
import tailwindcss from '@tailwindcss/vite';
import vue from '@vitejs/plugin-vue';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['maplibre-gl'],
        },
      },
    },
  },
  plugins: [
    vue(),
    tailwindcss(),
    ui({
      ui: {
        colors: {},
      },
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
});
