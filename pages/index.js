import { Box, Container, Tag, Text, useMediaQuery } from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/image";
import Card from "../components/card";
// import styles from '../styles/Home.module.css'
const StrapiUrl = process.env.STRAPI_URL;
import LandingBanner from "../public/images/landingbanner.png";
import NextLink from "next/link";
import MetaTags from "../components/metatags";

export async function getStaticProps(context) {
  let res = await (
    await fetch(`${StrapiUrl}/api/posts?populate=*&sort[0]=createdAt:desc`)
  ).json();
  let categories = await (await fetch(`${StrapiUrl}/api/categories`)).json();

  console.log(res.data);

  let publishedPosts = res.data?.map((item) => {
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
  console.log(categories);

  return {
    props: { posts: publishedPosts, categories }, // will be passed to the page component as props
  };
}

export default function Home({ posts, categories }) {
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");
  console.log(categories);
  return (
    <div>
      <MetaTags
        title="It works on pi"
        description={
          "Wander in the wonderful world of electronics, programming and in between"
        }
        image="https://itworksonpi.vercel.app/images/landingbanner.png"
        url={"https://itworksonpi.vercel.app"}
      />
      <Box>
        <Image src={LandingBanner} placeholder="blur" layout="responsive" />
      </Box>
      <Container mt="5" maxW={"8xl"}>
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
            width={isLargerThan1280 ? "20%" : "100%"}
            pl={isLargerThan1280 ? "10" : "0"}
            // boxShadow={"outline"}
          >
            <Box>
              {categories.data.map((element, index) => {
                return (
                  <Tag my={"2"} mr="2" key={index} colorScheme="green">
                    <NextLink href={`/category/${element.attributes.name}`}>
                      <Text casing={"capitalize"} cursor="pointer">
                        {element.attributes.name}
                      </Text>
                    </NextLink>
                  </Tag>
                );
              })}
            </Box>
            {/* <Box pt="10">Trending</Box> */}
          </Box>
        </Box>
      </Container>
    </div>
  );
}
