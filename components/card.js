import { Box, Link, Spacer, Tag, Text } from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import NextLink from "next/link";

export default function Card({ data, index }) {
  return (
    <Box
      maxW="8xl"
      borderWidth="1px"
      borderRadius="lg"
      overflow="hidden"
      key={index}
      mb="5"
      p="4"
    >
      <Box display={"flex"} justifyContent={"space-between"}>
        <NextLink
          href={`/post/${data.name.toLowerCase().replaceAll(" ", "-")}`}
        >
          <Text
            fontSize={"2xl"}
            noOfLines={1}
            casing={"capitalize"}
            cursor="pointer"
          >
            <Link>{data.name}</Link>
          </Text>
        </NextLink>
        <Spacer />
      </Box>
      <Box>
        {data.categories.map((element, index) => {
          return (
            <Tag my={"2"} mr="2" key={index} colorScheme="green">
              {element}
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
      <Text fontSize={"xl"} noOfLines={2}>
        {data.overview}
      </Text>
    </Box>
  );
}
