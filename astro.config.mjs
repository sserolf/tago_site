import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  publicDir: '/tago_site/',
  devToolbar: {
    enabled: false,
  },
  i18n: {
    defaultLocale: 'es',
    locales: ['es', 'en', 'fr', 'de', 'it', 'pt'],
    routing: {
      prefixDefaultLocale: false,
    },
  },
});
