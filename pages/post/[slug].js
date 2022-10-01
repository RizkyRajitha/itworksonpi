import { Box, Container, Text } from "@chakra-ui/react";
import { MDXProvider } from "@mdx-js/react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";

export async function getStaticPaths() {
  let res = await (await fetch("http://localhost:1337/api/posts")).json();
  console.log(res.data);

  let posts = res.data.map((item) => {
    let slug = item.attributes.Name.toLowerCase().replaceAll(" ", "-");
    return { params: { slug: slug } };
  });

  return {
    paths: posts,
    fallback: false, // can also be true or 'blocking'
  };
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
  console.log(context);

  let res = await (
    await fetch("http://localhost:1337/api/posts?populate=*")
  ).json();

  let post = res.data.filter(
    (post) =>
      post.attributes.Name.toLowerCase().replaceAll(" ", "-") ===
      context.params.slug
  )[0];

  console.log(post.attributes.markdown.data[0].attributes.url);

  let text = await fetch(
    `http://localhost:1337${post.attributes.markdown.data[0].attributes.url}`
  ).then((response) => response.text());

  const mdxSource = await serialize(text);

  return {
    // Passed to the page component as props
    props: { mdxSource },
  };
}

export default function Post({ mdxSource }) {
  const components = {
    h1: (props) => <Text fontSize={"4xl"} {...props} />,
    h2: (props) => <Text fontSize={"2xl"} {...props} />,
    h3: (props) => <Text fontSize={"xl"} {...props} />,
    h4: (props) => <Text fontSize={"lg"} {...props} />,
  };

  return (
    <Container maxW={"container.xl"} shadow="outline" mt="10">
      <Box display={"flex"} justifyContent="space-between">
        <Box maxW={"85%"} shadow="outline">
          <MDXProvider components={components}>
            <MDXRemote {...mdxSource} components={components} />
          </MDXProvider>
        </Box>
        <Box maxW={"15%"} shadow="outline">
          widgets
        </Box>
      </Box>
    </Container>
  );
}
