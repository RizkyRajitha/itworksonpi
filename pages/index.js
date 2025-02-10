import {
  Box,
  Container,
  Heading,
  Tag,
  Text,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import Image from "next/future/image";
import Card from "../components/card";
// import styles from '../styles/Home.module.css'
import LandingBanner from "../public/images/landingbanner.jpg";
import NextLink from "next/link";
import MetaTags from "../components/metatags";
import Footer from "../components/footer";
import FeatureCard from "../components/featurecard";
// import { getPlaiceholder } from "plaiceholder";
import { css } from "@emotion/react";
import "@fontsource/vt323";
import "@fontsource/noto-sans-mono";
import { useEffect, useState } from "react";
import Navbar from "../components/navbar";

const PublicUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const VERCEL_ENV = process.env.VERCEL_ENV || "dev";

import { getAllCategories, getAllPosts } from "../lib/getPosts";

export async function getStaticProps(context) {
  console.log("update index static props");
  let posts = getAllPosts();
  let categories = getAllCategories();

  let publishedPosts = posts.map((item) => {
    // const { base64, img } = await getPlaiceholder(
    //   `${PublicUrl}/api/og?title=${item.attributes.name}`,
    //   { size: 32 }
    // );

    return {
      title: item.title,
      slug: item.slug,
      date: item.date,
      overview: item.overview,
      featured: item.featured,
      categories: item.categories.split(","),
      // coverArtUrl: img,
      // coverArtBlurData: base64,
    };
  });

  // console.log(publishedPosts);
  // console.log(categories);

  return {
    props: { posts: publishedPosts, categories: categories }, // will be passed to the page component as props
  };
}

export default function Home({ posts, categories }) {
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");
  const [postState, setpostState] = useState(posts);
  // console.log(categories);

  useEffect(() => {
    window.addEventListener("scroll", scrollHandler);

    return () => {
      window.removeEventListener("scroll", scrollHandler);
    };
  }, []);

  const scrollHandler = () => {
    // console.log(window.innerHeight);
    // console.log(document.documentElement.scrollTop);
    // if (
    //   window.innerHeight + document.documentElement.scrollTop !==
    //   document.documentElement.offsetHeight
    // ) {
    //   return;
    // }
    // console.log("nani");
    // setpostState((preState) => {
    //   return [...preState, ...posts];
    // });
  };

  return (
    <div>
      <MetaTags
        title="CodeHiRise"
        description={
          "Wander in the wonderful world of electronics, programming, web dev and in between"
        }
        image={`${PublicUrl}/images/ogmetabanner.png`}
        url={`${PublicUrl}`}
      />
      <Navbar />
      <Box
        h={["32vh", "32vh", "32vh", "28vh", "28vh"]}
        display="flex"
        alignItems={"center"}
        justifyContent="center"
      >
        <Image
          src={LandingBanner}
          style={{
            height: "28vh",
            // height: isLargerThan1280 ? "28vh" : "32vh",
            // marginTop: isLargerThan1280 ? "0vh" : "2vh",
            width: "100%",
            objectFit: "cover",
            position: "absolute",
          }}
          alt="banner"
          placeholder="blur"
        />
        <Heading
          as={"h1"}
          position={"relative"}
          textAlign="center"
          fontSize={["6xl", "9xl"]}
          fontFamily={"VT323"}
          color={useColorModeValue("#fff", "#fff")}
          data-umami-event="Logo"
        >
          CodeHiRise
        </Heading>
      </Box>
      <Container
        mt="5"
        maxW={"8xl"}
        minH="82vh"
        transition={"all"}
        transitionDuration="2s"
        animation={"normal"}
      >
        <Text
          align={"center"}
          fontSize="2xl"
          pb="10"
          pt={["6", "6", "6", "6", "0"]}
          fontFamily={"Noto Sans Mono;monospace"}
        >
          Wander in the wonderful world of electronics, web dev and in between
        </Text>
        <Box
          display={"flex"}
          flexDirection={["column", "column", "column", "row"]}
          // boxShadow={"outline"}
          justifyContent="space-between"
        >
          <Box width={["100%", "100%", "100%", "75%"]}>
            {postState.map((element, index) => {
              return (
                <Card
                  name={element?.title}
                  slug={element?.slug}
                  createdAt={element?.date}
                  categories={element?.categories}
                  overview={element?.overview}
                  index={index}
                  key={index}
                />
              );
            })}
          </Box>
          <Box
            width={["100%", "100%", "100%", "25%"]}
            pl={["0", "0", "0", "10"]}
            // boxShadow={"outline"}
          >
            <Text fontSize="4xl" align={["center", "center", "center", "left"]}>
              Topics
            </Text>
            <Box textAlign={["center", "center", "center", "left"]}>
              {[...new Set(categories)].map((element, index) => {
                return (
                  <NextLink
                    href={`/category/${String(element).toLowerCase()}`}
                    key={index}
                    passHref
                  >
                    <Tag
                      data-umami-event="Categories"
                      mt="2"
                      mr="2"
                      colorScheme="green"
                      cursor={"pointer"}
                      as="a"
                      p="1.5"
                    >
                      <Text casing={"capitalize"} as="span">
                        {element}
                      </Text>
                    </Tag>
                  </NextLink>
                );
              })}
            </Box>
            <Text
              fontSize="4xl"
              pt="10"
              align={["center", "center", "center", "left"]}
            >
              Featured
            </Text>
            <Box pt="4" width={"100%"}>
              <Box>
                {posts
                  .filter((post) => post.featured === "true")
                  .map((element, index) => {
                    return (
                      <FeatureCard data={element} index={index} key={index} />
                    );
                  })}
              </Box>
            </Box>
            {/* <Text
              fontSize="4xl"
              pt="10"
              align={["center", "center", "center", "left"]}
              href="/explore"
              _hover={{
                textDecoration: "underline #a9b5af",
                textDecorationStyle: "dashed",
              }}
            >
              <NextLink href="/explore">Explore</NextLink>
            </Text> */}
            {/* <ExploreWidget posts={posts} /> */}
            <Box position={"sticky"} top="90vh" pb="4" px="4">
              <Box
                display={"flex"}
                flexDirection={["row", "row", "row", "column"]}
                // boxShadow={"outline"}
                alignItems={["baseline", "baseline", "baseline", "center"]}
                justifyContent="space-between"
              >
                <Text fontFamily={"VT323"} fontSize="4xl" textAlign={"center"}>
                  CodeHiRise
                </Text>
                <Text align={"center"}>
                  All rights reserved {new Date().getFullYear()}
                </Text>
              </Box>
            </Box>
          </Box>
        </Box>
      </Container>
      {/* <Footer /> */}
    </div>
  );
}
