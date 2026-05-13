import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const products = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/products' }),
  schema: z.object({
    name: z.string(),
    slug: z.string().optional(),
    category: z.enum(['peptides', 'amino-acids', 'supplies', 'glassware']),
    cas: z.string().optional(),
    molecularFormula: z.string().optional(),
    molecularWeight: z.number().optional(),
    purity: z.string(),
    sizes: z.array(
      z.object({
        size: z.string(),
        sku: z.string(),
      }),
    ).min(1),
    description: z.string(),
    storage: z.string(),
    coaUrl: z.string().optional(),
    featured: z.boolean().default(false),
    inStock: z.boolean().default(true),
  }),
});

export const collections = { products };
