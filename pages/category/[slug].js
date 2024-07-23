import { Box, Container, Text } from "@chakra-ui/react";
// import CategoryCard from "../../components/categorycard";
import Navbar from "../../components/navbar";
import MetaTags from "../../components/metatags";
// import { getPlaiceholder } from "plaiceholder";
import Footer from "../../components/footer";
import Card from "../../components/card";
import { getAllCategories, getPostByCategories } from "../lib/getPosts";
// import Navbar from "../../components/navbar";

const PublicUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

export async function getStaticPaths() {
  try {
    let categories = getAllCategories().map((item) => {
      let slug = item.toLowerCase();
      console.log(slug);
      return { params: { slug: slug } };
    });
    return {
      paths: categories,
      fallback: false, // can also be true or 'blocking'
    };
  } catch (error) {
    console.log(error);
    return {
      paths: [{}],
      fallback: false, // can also be true or 'blocking'
    };
  }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
  let category = {
    name: context.params.slug,
    posts: getPostByCategories(context.params.slug),
  };
  console.log(category);

  return {
    props: {
      category,
    },
  };
}

export default function Category({ category }) {
  return (
    <>
      <MetaTags
        title={`${category.name.charAt(0).toUpperCase()}${category.name
          .slice(1)
          .toLowerCase()}`}
        description={`Posts belong to ${category.name} category`}
        image={`${PublicUrl}/api/og?title=${category.name}`}
        url={`${PublicUrl}/category/${category.name}`}
      />
      <Navbar />
      <Container maxW={"8xl"} mt="10" minH={"82vh"}>
        <Text
          fontSize={"6xl"}
          my="8"
          color={"#1CB5E0"}
          as="h1"
          // bgGradient="linear(to-l, #4ECDC4,  #1CB5E0)"
          // bgGradient="linear(to-l, #7928CA, #FF0080)"
          // bgGradient="linear(to-l, #DC2424,  #4A569D)"
          // bgClip="text"
          fontWeight="extrabold"
          casing={"capitalize"}
        >
          {category.name}
        </Text>
        <Box width={"100%"}>
          {category.posts.map((element, index) => {
            return (
              <Card
                name={element?.title}
                slug={element?.slug}
                createdAt={element?.date}
                categories={element.categories.split(",")}
                index={index}
                overview={element.overview}
                key={index}
              />
            );
          })}
        </Box>
      </Container>
      <Footer />
    </>
  );
}
