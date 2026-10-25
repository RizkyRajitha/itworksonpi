import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    // optional: last meaningful edit, used for dateModified / article:modified_time
    updated: z.coerce.date().optional(),
    categories: z.string(),
    featured: z.preprocess(
      (v) => v === 'true' || v === true,
      z.boolean()
    ),
    overview: z.string(),
    // optional: short meta description (search snippets cut off around 160 chars).
    // Falls back to a trimmed `overview`.
    description: z.string().max(160).optional(),
  }),
});

export const collections = { blog };
