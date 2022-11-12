import {
  Box,
  Container,
  Heading,
  Tag,
  Text,
  useMediaQuery,
} from "@chakra-ui/react";
import Image from "next/future/image";
import Card from "../components/card";
// import styles from '../styles/Home.module.css'
const StrapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
import LandingBanner from "../public/images/landingbanner.png";
import NextLink from "next/link";
import MetaTags from "../components/metatags";
import Footer from "../components/footer";
import FeatureCard from "../components/featurecard";
import ExploreWidget from "../components/explorewidget";
// import { getPlaiceholder } from "plaiceholder";

const PublicUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

export async function getStaticProps(context) {
  let res = await (
    await fetch(`${StrapiUrl}/api/posts?populate=*&sort[0]=createdAt:desc`)
  ).json();
  let categories = await (await fetch(`${StrapiUrl}/api/categories`)).json();

  console.log(res.data);

  let publishedPosts = res.data?.map((item) => {
    // const { base64, img } = await getPlaiceholder(
    //   `${PublicUrl}/api/og?title=${item.attributes.name}`,
    //   { size: 32 }
    // );

    return {
      name: item.attributes.name,
      createdAt: item.attributes.createdAt,
      overview: item.attributes.overview,
      categories: item.attributes.categories.data.map(
        (item) => item.attributes.name
      ),
      // coverArtUrl: img,
      // coverArtBlurData: base64,
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
  // console.log(categories);
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
        h={["28vh", "28vh", "28vh", "32vh", "32vh"]}
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
          fontSize={["6xl", "8xl"]}
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
          pt={["6", "6", "6", "0"]}
          fontFamily={"Noto Sans Mono"}
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
            {posts.map((element, index) => {
              return <Card data={element} index={index} key={index} />;
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
            <Text
              fontSize="4xl"
              pt="10"
              align={["center", "center", "center", "left"]}
            >
              Featured
            </Text>
            <Box pt="4" width={"100%"}>
              <Box>
                {posts.map((element, index) => {
                  return (
                    <FeatureCard data={element} index={index} key={index} />
                  );
                })}
              </Box>
            </Box>
            <ExploreWidget posts={posts} />
          </Box>
        </Box>
      </Container>
      <Footer />
    </div>
  );
}
