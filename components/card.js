import { Box, Link, Spacer, Tag, Text, useMediaQuery } from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import NextLink from "next/link";
import Image from "next/future/image";

const PublicUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

export default function Card({ data, index }) {
  const [isLargerThan980] = useMediaQuery("(min-width: 720px)");

  return (
    <Box
      maxW="8xl"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      key={index}
      mb="5"
      p="4"
      display={"flex"}
      flexDirection={["column-reverse", "column-reverse", "row"]}
      // flexDirection={isLargerThan980 ? "row" : "column-reverse"}
    >
      <Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          <NextLink
            href={`/post/${data.name.toLowerCase().replaceAll(" ", "-")}`}
          >
            <Text
              fontSize={"2xl"}
              noOfLines={[3, 2, 1]}
              // noOfLines={isLargerThan980 ? 1 : 2}
              casing={"capitalize"}
              cursor="pointer"
              bgGradient="linear(to-l, #4ECDC4,  #1CB5E0)"
              bgClip="text"
              _hover={{
                textDecoration: "underline #a9b5af",
                textDecorationStyle: "dashed",
              }}
            >
              <Link
                href={`/post/${data.name.toLowerCase().replaceAll(" ", "-")}`}
              >
                {data.name}
              </Link>
            </Text>
          </NextLink>
          <Spacer />
        </Box>
        <Box>
          {data.categories.map((element, index) => {
            return (
              <Tag my={"2"} mr="2" key={index} colorScheme="green">
                <NextLink href={`/category/${element}`}>
                  <Text casing={"capitalize"} cursor="pointer">
                    {element}
                  </Text>
                </NextLink>
              </Tag>
            );
          })}
        </Box>
        <Box py={"2"}>
          {data.createdAt &&
            formatDistance(new Date(data.createdAt), new Date(), {
              addSuffix: true,
            })}
        </Box>
        <Text fontSize={"xl"} noOfLines={3}>
          {data.overview}
        </Text>
      </Box>
      <Spacer />
      <Box
        // maxW={isLargerThan980 ? "40%" : "100%"}
        maxW={["100%", "100%", "40%"]}
        minW="40%"
        display={"flex"}
        alignItems="center"
      >
        <Image
          src={`${PublicUrl}/api/og?title=${data.name}`}
          alt={`${data.name} cover art`}
          width="1200"
          height="630"
          // placeholder="blur"
          // blurDataURL={modalImage.placeholder}
        />
      </Box>
    </Box>
  );
}
