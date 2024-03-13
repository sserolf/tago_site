import { defineConfig } from 'astro/config';

import vercel from '@astrojs/vercel/serverless';

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
  output: 'server',
  adapter: vercel(),
});
