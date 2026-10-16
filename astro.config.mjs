// @ts-check
import { defineConfig } from 'astro/config';

export default defineConfig({
  output: 'static',
  site: 'https://vicentealtamirano28-glitch.github.io',
  base: '/portafolio-app',
  vite: {
    // Keep every script as an external file so the CSP can use script-src 'self' without hashes.
    build: { assetsInlineLimit: 0 },
  },
});
