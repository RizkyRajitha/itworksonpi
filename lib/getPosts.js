import fs from "fs";
import matter from "gray-matter";
import { join } from "path";

const postsDirectory = join(process.cwd(), "_posts");

export function getPostSlugs() {
  return fs
    .readdirSync(postsDirectory)
    .filter((slug) => slug.substr(slug.length - 2) == "md");
}

export function getPostBySlug(slug) {
  console.log(slug.substr(slug.length - 2));
  const realSlug = slug.replace(/\.md$/, "");
  const fullPath = join(postsDirectory, `${realSlug}.md`);
  const fileContents = fs.readFileSync(fullPath, "utf8");
  const { data, content } = matter(fileContents);

  return { ...data, slug: realSlug, content };
}

export function getAllPosts() {
  const slugs = getPostSlugs();
  console.log(slugs);
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    // sort posts by date in descending order
    .sort((post1, post2) => (post1.date > post2.date ? -1 : 1));
  return posts;
}

export function getAllCategories() {
  const slugs = getPostSlugs();
  // console.log(slugs);
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .reduce((pV, cV) => [...pV, ...String(cV?.categories).split(",")], []);
  // console.log(posts);
  return posts;
}

export function getPostByCategories(cat) {
  const slugs = getPostSlugs();
  // console.log(slugs);
  const posts = slugs
    .map((slug) => getPostBySlug(slug))
    .filter((post) =>
      [...post.categories.split(",")]
        .map((name) => String(name).toLocaleLowerCase())
        .includes(cat)
    );
  // console.log(posts);
  return posts;
}
