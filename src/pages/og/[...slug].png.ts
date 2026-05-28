import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { uniqueCategories, categorySlug } from '../../lib/categories';
import { renderOgPng } from '../../lib/og';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  const categories = uniqueCategories(posts);

  const paths = [
    {
      params: { slug: 'index' },
      props: { title: 'CodeHiRise' },
    },
    ...posts.map((p) => ({
      params: { slug: `post/${p.id.replace(/\.(md|mdx)$/, '')}` },
      props: { title: p.data.title },
    })),
    ...categories.map((name) => ({
      params: { slug: `category/${categorySlug(name)}` },
      props: { title: name },
    })),
  ];

  return paths;
};

export const GET: APIRoute = async ({ props }) => {
  const { title } = props as { title: string };
  const png = await renderOgPng(title);
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
