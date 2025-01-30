import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 3000,
  },
  css: {
    postcss: '/postcss.config.js',
  },
});
