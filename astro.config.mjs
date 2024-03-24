import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel/serverless';
import lit from '@astrojs/lit';

// https://astro.build/config
export default defineConfig({
  devToolbar: {
    enabled: false,
  },
  output: 'server',
  adapter: vercel(),
  prefetch: false,
  integrations: [lit()],
});
