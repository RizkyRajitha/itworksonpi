import { Box, Container, Spacer, Tag, Text } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import Card from "../components/card";
// import styles from '../styles/Home.module.css'
const StrapiUrl = process.env.STRAPI_URL;

export async function getStaticProps(context) {
  let res = await (await fetch(`${StrapiUrl}/api/posts?populate=*`)).json();
  console.log(res.data);

  let publishedPosts = res.data
    ?.filter((item) => item?.attributes.publish)
    .map((item) => {
      return {
        name: item.attributes.name,
        createdAt: item.attributes.createdAt,
        overview: item.attributes.overview,
        categories: item.attributes.categories.data.map(
          (item) => item.attributes.name
        ),
      };
    });

  console.log(publishedPosts);

  return {
    props: { posts: publishedPosts }, // will be passed to the page component as props
  };
}

export default function Home({ posts }) {
  return (
    <div>
      <Container mt="5" maxW={"container.xl"}>
        <Text
          align={"center"}
          fontSize="6xl"
          pb="10"
          fontFamily={"Noto Sans Mono"}
        >
          All things pi
        </Text>
        <Box
          display={"flex"}
          // boxShadow={"outline"}
          justifyContent="space-between"
        >
          <Box width={"80%"}>
            {posts.map((element, index) => {
              return <Card data={element} index={index} />;
            })}
          </Box>
          <Box width={"10%"}>
            {/* <Box>posts</Box>
            <Box>posts</Box>
            <Box>posts</Box>
            <Box>posts</Box>
            <Box>posts</Box> */}
          </Box>
        </Box>
      </Container>
    </div>
  );
}
