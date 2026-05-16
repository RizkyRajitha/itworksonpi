import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    categories: z.string(),
    featured: z.preprocess(
      (v) => v === 'true' || v === true,
      z.boolean()
    ),
    overview: z.string(),
  }),
});

export const collections = { blog };
