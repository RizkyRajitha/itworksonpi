import { Box, Container, Text } from "@chakra-ui/react";
// import CategoryCard from "../../components/categorycard";
import Navbar from "../../components/navbar";
import MetaTags from "../../components/metatags";
import { getPlaiceholder } from "plaiceholder";
import Footer from "../../components/footer";
import Card from "../../components/card";
// import Navbar from "../../components/navbar";

const StrapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
const PublicUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

export async function getStaticPaths() {
  try {
    let res = await (await fetch(`${StrapiUrl}/api/categories`)).json();
    console.log(res.data);

    let categories = res?.data?.map((item) => {
      let slug = item.attributes.name.toLowerCase();
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
  let res = await (
    await fetch(
      `${StrapiUrl}/api/categories?[filters][name]=${context.params.slug}&populate[posts][populate][0]=coverArt&populate[posts][populate][1]=categories`
    )
  ).json();

  let category = res.data[0];
  getPlaiceholder("");
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
        title={category.attributes.name}
        description={`Posts belong to ${category.attributes.name} category`}
        image={`${PublicUrl}/api/og?title=${category.attributes.name}`}
        url={`https://itworksonpi.vercel.app/category/${category.attributes.name}`}
      />
      <Navbar />
      <Container maxW={"8xl"} mt="10" minH={"82vh"}>
        <Text
          fontSize={"6xl"}
          my="8"
          color={"#1CB5E0"}
          // bgGradient="linear(to-l, #4ECDC4,  #1CB5E0)"
          // bgGradient="linear(to-l, #7928CA, #FF0080)"
          // bgGradient="linear(to-l, #DC2424,  #4A569D)"
          // bgClip="text"
          fontWeight="extrabold"
          casing={"capitalize"}
        >
          {category.attributes.name}
        </Text>
        <Box width={"100%"}>
          {category.attributes.posts.data.map((element, index) => {
            return (
              <Card
                name={element.attributes?.name}
                slug={element.attributes?.slug}
                createdAt={element?.attributes?.createdAt}
                categories={element.attributes.categories.data.map((ele) => {
                  return ele.attributes.name;
                })}
                index={index}
                overview={element.attributes.overview}
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
