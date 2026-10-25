import rss from '@astrojs/rss';
import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { postCategories, sortPostsByDateDesc } from '../lib/categories';
import { DESCRIPTION, SITE_NAME, postSlug } from '../lib/site';

export const GET: APIRoute = async ({ site }) => {
  const posts = sortPostsByDateDesc(await getCollection('blog'));
  return rss({
    title: SITE_NAME,
    description: DESCRIPTION,
    site: site!,
    trailingSlash: false,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.overview,
      pubDate: post.data.date,
      link: `/post/${postSlug(post)}`,
      categories: postCategories(post),
    })),
    customData: '<language>en-us</language>',
  });
};
