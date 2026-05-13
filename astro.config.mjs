import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// TODO: replace with your production domain before launch (used for sitemap & canonical URLs).
const SITE_URL = 'https://longhornsupply.com';

export default defineConfig({
  site: SITE_URL,
  integrations: [
    tailwind({ applyBaseStyles: false }),
    sitemap({
      filter: (page) =>
        !page.includes('/quote-request') && !page.includes('/cart'),
    }),
  ],
});
