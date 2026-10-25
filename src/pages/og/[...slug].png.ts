import type { APIRoute, GetStaticPaths } from 'astro';
import { getCollection } from 'astro:content';
import { uniqueCategories, categorySlug, postCategories } from '../../lib/categories';
import { renderOgPng, type OgOptions } from '../../lib/og';
import { postSlug } from '../../lib/site';

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection('blog');
  const categories = uniqueCategories(posts);

  const paths = [
    {
      params: { slug: 'index' },
      props: {
        title: 'CodeHiRise',
        pathLabel: '~/codehirise',
        variant: 'index',
      } satisfies OgOptions,
    },
    {
      params: { slug: 'explore' },
      props: {
        title: 'Explore the archive',
        pathLabel: '~/codehirise/explore',
        categories: categories.slice(0, 4),
        variant: 'explore',
      } satisfies OgOptions,
    },
    ...posts.map((p) => {
      const slug = postSlug(p);
      return {
        params: { slug: `post/${slug}` },
        props: {
          title: p.data.title,
          pathLabel: `~/codehirise/posts/${slug}.md`,
          categories: postCategories(p),
          variant: 'post',
        } satisfies OgOptions,
      };
    }),
    ...categories.map((name) => ({
      params: { slug: `category/${categorySlug(name)}` },
      props: {
        title: name,
        pathLabel: `~/codehirise/topics/${categorySlug(name)}`,
        categories: [name],
        variant: 'category',
      } satisfies OgOptions,
    })),
  ];

  return paths;
};

export const GET: APIRoute = async ({ props }) => {
  const png = await renderOgPng(props as OgOptions);
  return new Response(png, {
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
};
