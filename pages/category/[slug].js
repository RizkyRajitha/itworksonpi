import { Box, Container, Text } from "@chakra-ui/react";
import CategoryCard from "../../components/categorycard";
import Navbar from "../../components/navbar";
import MetaTags from "../../components/metatags";
import { getPlaiceholder } from "plaiceholder";
import Footer from "../../components/footer";
// import Navbar from "../../components/navbar";

const StrapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;

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
        image="https://itworksonpi.vercel.app/images/ogmetabanner.png"
        url={`https://itworksonpi.vercel.app/category/${category.attributes.name}`}
      />
      <Navbar />
      <Container maxW={"container.xl"} mt="10">
        <Text
          fontSize={"6xl"}
          my="8"
          // bgGradient="linear(to-l, #7928CA, #FF0080)"
          bgGradient="linear(to-l, #DC2424,  #4A569D)"
          bgClip="text"
          fontWeight="extrabold"
          casing={"capitalize"}
        >
          {category.attributes.name}
        </Text>
        <Box width={"100%"}>
          {category.attributes.posts.data.map((element, index) => {
            console.log(element);
            return (
              <CategoryCard
                data={element.attributes}
                index={index}
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
