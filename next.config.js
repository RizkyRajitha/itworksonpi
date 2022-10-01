/** @type {import('next').NextConfig} */
const withMDX = require("@next/mdx")();
// const nextConfig = {
//   reactStrictMode: true,
//   swcMinify: true,
//   withMDX: withMDX(),
// };

// // module.exports = withMDX();

// module.exports = nextConfig;

module.exports = withMDX({
  reactStrictMode: true,
  swcMinify: true,
  pageExtensions: ["js", "jsx", "md", "mdx"],
});
