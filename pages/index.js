import {
  Box,
  Container,
  Spacer,
  Tag,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import Card from "../components/card";
// import styles from '../styles/Home.module.css'
const StrapiUrl = process.env.STRAPI_URL;
import LandingBanner from "../public/images/landingbanner.png";

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
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");

  return (
    <div>
      <Box>
        <Image src={LandingBanner} placeholder="blur" layout="responsive" />
      </Box>
      <Container mt="5" maxW={"container.xl"}>
        <Text
          align={"center"}
          fontSize="2xl"
          pb="10"
          fontFamily={"Noto Sans Mono"}
        >
          Wander in the wonderful world of electronics, programming and in
          between
        </Text>
        <Box
          display={"flex"}
          flexDirection={isLargerThan1280 ? "row" : "column"}
          // boxShadow={"outline"}
          justifyContent="space-between"
        >
          <Box width={isLargerThan1280 ? "80%" : "100%"}>
            {posts.map((element, index) => {
              return <Card data={element} index={index} key={index} />;
            })}
          </Box>
          <Box
            width={isLargerThan1280 ? "10%" : "100%"}
            // boxShadow={"outline"}
          >
            <Box>Categories</Box>

            {/* <Box>posts</Box>
            <Box>posts</Box>
            <Box>posts</Box>
            <Box>posts</Box> */}
          </Box>
        </Box>
      </Container>
    </div>
  );
}
