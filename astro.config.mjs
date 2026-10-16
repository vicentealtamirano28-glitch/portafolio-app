// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  vite: {
    // Keep every script as an external file so the CSP can use script-src 'self' without hashes.
    build: { assetsInlineLimit: 0 },
  },
});
