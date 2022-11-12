import { Box, Container, Heading, Input } from "@chakra-ui/react";
import Navbar from "../components/navbar";
import MetaTags from "../components/metatags";
import Footer from "../components/footer";
import Card from "../components/card";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

const StrapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

export async function getStaticProps(context) {
  let res = await (
    await fetch(`${StrapiUrl}/api/posts?populate=*&sort[0]=createdAt:desc`)
  ).json();

  let posts = res.data?.map((item) => {
    return {
      name: item.attributes.name,
      createdAt: item.attributes.createdAt,
      overview: item.attributes.overview,
      categories: item.attributes.categories.data.map(
        (item) => item.attributes.name
      ),
    };
  });

  console.log(posts);
  return {
    props: {
      posts,
    },
  };
}

export default function Category({ posts }) {
  const [matches, setMatches] = useState([]);
  const [nomatches, setnoMatches] = useState(false);
  const [searchText, setsearchText] = useState("");
  const router = useRouter();

  const handleChange = (value) => {
    setsearchText(value);
    router.push(`/explore?text=${value}`, undefined, {
      shallow: true,
    });
    setnoMatches(false);
    if (value.length === 0) {
      setMatches([]);
      return;
    }

    let matches = posts
      .map((ele) => {
        if (ele?.name.match(new RegExp(value, "gi"))?.length > 0) {
          return ele;
        }
      })
      .filter((n) => n);

    setnoMatches(matches.length === 0);
    setMatches(matches);
  };

  useEffect(() => {
    let params = new URL(document.location).searchParams;
    if (params.get("text")) {
      handleChange(params.get("text"));
      setsearchText(params.get("text"));
    }
  }, []);

  return (
    <>
      <MetaTags
        title="Explore"
        description={"Explore posts"}
        image="https://itworksonpi.vercel.app/images/ogmetabanner.png"
        url={`https://itworksonpi.vercel.app/explore`}
      />
      <Navbar />
      <Container maxW={"8xl"} mt="10" minH={"82vh"}>
        <Box pt="2">
          <Input
            value={searchText}
            placeholder="Explore..."
            size={["md", "md", "md", "lg"]}
            _placeholder={{ opacity: 1, color: "gray.200" }}
            onChange={(e) => {
              handleChange(e.target.value);
            }}
          />
        </Box>
        <Box pt="6" width={"100%"}>
          {matches.length > 0 &&
            matches.map((ele, index) => {
              return <Card data={ele} index={index} key={index} />;
            })}
          {nomatches && (
            <Heading
              textAlign={"center"}
              fontWeight="normal"
              size={["md", "md", "md", "xl"]}
            >
              There are some who would not deem it wise
            </Heading>
          )}
        </Box>
      </Container>
      <Footer />
    </>
  );
}
