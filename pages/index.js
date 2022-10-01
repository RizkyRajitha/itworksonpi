import { Box, Container, Spacer, Tag, Text } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import Card from "../components/home";
// import styles from '../styles/Home.module.css'

export async function getStaticProps(context) {
  let res = await (
    await fetch("http://localhost:1337/api/posts?populate=*")
  ).json();
  console.log(res.data);

  let publishedPosts = res.data
    ?.filter((item) => item?.attributes.publish)
    .map((item) => {
      return {
        name: item.attributes.Name,
        createdAt: item.attributes.createdAt,
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
        <Text align={"center"}>All things pi</Text>
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
          <Box width={"10%"} boxShadow={"outline"}>
            <Box>posts</Box>
            <Box>posts</Box>
            <Box>posts</Box>
            <Box>posts</Box>
            <Box>posts</Box>
          </Box>
        </Box>
      </Container>
    </div>
  );
}
