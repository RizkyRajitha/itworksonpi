import Head from "next/head";

export default function MetaTags({ title, description, image, url }) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="title" content={title} />
      <meta name="description" content={description} />

      <meta charSet="utf-8" />
      <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      <meta name="theme-color" content="#1a202c" />

      {/* Open Graph / Facebook  */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter  */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={title} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      <meta
        name="keywords"
        content=" arduino , rasberrypi , nodemcu , software,programming, coding, development, engineering,"
      />
    </Head>
  );
}
