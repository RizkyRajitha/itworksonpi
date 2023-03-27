const StrapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
const PublicUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <!--We manually set the two URLs we know already-->
     <url>
       <loc>${PublicUrl}</loc>
     </url>
     ${posts
       .map(({ attributes }) => {
         return `
       <url>
           <loc>${`${PublicUrl}/post/${attributes.slug}`}</loc>
       </url>
     `;
       })
       .join("")}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const request = await fetch(
    `${StrapiUrl}/api/posts?sort[0]=createdAt:desc&filters[publish][$eq]=true`
  );
  const posts = await request.json();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts.data);

  res.setHeader("Content-Type", "text/xml");
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;
