import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import lit from '@astrojs/lit';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: true,
  },
  output: 'server',
  adapter: vercel(),
  prefetch: false,
  site: 'https://tago-site.vercel.app/',
  integrations: [lit(), sitemap()],
});
