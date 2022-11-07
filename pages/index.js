import {
  Box,
  Container,
  Heading,
  Tag,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Head from "next/head";
import Image from "next/future/image";
import Card from "../components/card";
// import styles from '../styles/Home.module.css'
const StrapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
import LandingBanner from "../public/images/landingbanner.png";
import NextLink from "next/link";
import MetaTags from "../components/metatags";
import Footer from "../components/footer";
import FeatureCard from "../components/featurecard";

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
  const [isLargerThan400] = useMediaQuery("(min-width: 400px)");
  console.log(categories);
  return (
    <div>
      <MetaTags
        title="It works on pi"
        description={
          "Wander in the wonderful world of electronics, programming, web dev and in between"
        }
        image="https://itworksonpi.vercel.app/images/ogmetabanner.png"
        url={"https://itworksonpi.vercel.app"}
      />
      <Box
        h={isLargerThan1280 ? "28vh" : "32vh"}
        display="flex"
        alignItems={"center"}
        justifyContent="center"
      >
        <Image
          src={LandingBanner}
          style={{
            height: isLargerThan1280 ? "28vh" : "32vh",
            width: "100%",
            objectFit: "cover",
            position: "absolute",
          }}
          alt="banner"
          placeholder="blur"
        />
        <Text
          position={"relative"}
          textAlign="center"
          fontSize={isLargerThan400 ? "8xl" : "6xl"}
          fontFamily={"VT323"}
        >
          it works on pi
        </Text>
      </Box>
      <Container mt="5" maxW={"8xl"} minH="82vh">
        <Text
          align={"center"}
          fontSize="2xl"
          pb="10"
          fontFamily={"Noto Sans Mono"}
        >
          Wander in the wonderful world of electronics, web dev and in between
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
            <Text fontSize="4xl">Topics</Text>
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
            <Text fontSize="4xl" pt="10">
              Featured
            </Text>
            <Box pt="4">
              <Box>
                {posts.map((element, index) => {
                  return (
                    <FeatureCard data={element} index={index} key={index} />
                  );
                })}
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
