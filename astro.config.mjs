import { defineConfig } from 'astro/config';

import node from '@astrojs/node';

// https://astro.build/config
export default defineConfig({
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
  output: 'hybrid',
  adapter: node({
    mode: 'standalone',
  }),
});
