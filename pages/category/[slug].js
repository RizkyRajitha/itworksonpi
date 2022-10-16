import { useState } from "react";
import {
  Box,
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spacer,
  Tag,
  Text,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/future/image";
import { formatDistance } from "date-fns";
import CategoryCard from "../../components/categorycard";
import Navbar from "../../components/navbar";
// import { getPlaiceholder } from "plaiceholder";
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

  console.log(category);

  return {
    props: {
      category,
    },
  };
}

export default function Category({ category }) {
  console.log(category);

  return (
    <>
      <Navbar />
      <Container maxW={"container.xl"} mt="10">
        <Text casing={"capitalize"}>
          <Tag fontSize={"6xl"} my="8" colorScheme="green">
            {category.attributes.name}
          </Tag>
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
    </>
  );
}
