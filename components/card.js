import {
  Box,
  Link,
  Spacer,
  Tag,
  Text,
  Tooltip,
  useColorModeValue,
} from "@chakra-ui/react";
import { format, formatDistance, parseISO } from "date-fns";
import NextLink from "next/link";
import Image from "next/future/image";

const PublicUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const CommitSha = process.env.VERCEL_GIT_COMMIT_SHA || "9977";

export default function Card({
  createdAt,
  categories,
  name,
  slug,
  overview,
  index,
}) {
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
    >
      <Box>
        <Box display={"flex"} justifyContent={"space-between"}>
          <NextLink href={`/post/${slug}`}>
            <Text
              fontSize={"2xl"}
              noOfLines={[3, 2, 1]}
              // noOfLines={isLargerThan980 ? 1 : 2}
              casing={"capitalize"}
              cursor="pointer"
              bgGradient="linear(to-l, #4ECDC4,  #1CB5E0)"
              // bgGradient={useColorModeValue(
              //   "linear(to-l, #DC2424,  #4A569D)",
              //   "linear(to-br, #4ECDC4,  #1CB5E0)"
              // )}
              bgClip="text"
              _hover={{
                textDecoration: "underline #a9b5af",
                textDecorationStyle: "dashed",
              }}
            >
              <Link href={`/post/${slug}`}>{name}</Link>
            </Text>
          </NextLink>
          <Spacer />
        </Box>
        <Box>
          {categories.map((element, index) => {
            return (
              <NextLink href={`/category/${element}`} key={index} passHref>
                <Tag
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
        <Box py={"2"}>
          <Tooltip
            placement="right"
            label={`${format(parseISO(createdAt), "HH:MM MM/dd/yyyy")}`}
            aria-label="Time"
          >
            {createdAt &&
              formatDistance(new Date(createdAt), new Date(), {
                addSuffix: true,
              })}
          </Tooltip>
        </Box>
        <Text fontSize={"xl"} noOfLines={3}>
          {overview}
        </Text>
      </Box>
      <Spacer />
      <Box
        // maxW={isLargerThan980 ? "40%" : "100%"}
        maxW={["100%", "100%", "40%"]}
        minW="40%"
        display={"flex"}
        alignItems="center"
        borderRadius="lg"
        overflow="hidden"
      >
        <Image
          src={`${PublicUrl}/api/og?title=${name}&id=${CommitSha}`}
          alt={`${name} cover art`}
          width="1200"
          height="630"
          // placeholder="blur"
          // blurDataURL={modalImage.placeholder}
        />
      </Box>
    </Box>
  );
}
