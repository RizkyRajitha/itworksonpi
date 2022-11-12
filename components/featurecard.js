import { Box, Link, Spacer, Tag, Text, useMediaQuery } from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import NextLink from "next/link";
import { motion } from "framer-motion";

export default function FeatureCard({ data, index }) {
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");

  return (
    <motion.div
      whileHover={{ scale: isLargerThan1280 ? 1.1 : 1.03 }}
      transition={{ duration: 0.2 }}
    >
      <Box
        maxW="8xl"
        // borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        key={index}
        mb="5"
        p="0.5"
        // mx={isLargerThan1280 ? "0" : "5"}
        mx={[5, 5, 5, 0]}
        bgGradient="linear(to-l, #7928CA, #FF0080)"
        // bgClip={"text"}
      >
        <Box p="3" bgColor={"#1a202c"} borderRadius="lg">
          <Box display={"flex"} justifyContent={"space-between"}>
            <NextLink
              href={`/post/${data.name.toLowerCase().replaceAll(" ", "-")}`}
            >
              <Text
                // fontSize={isLargerThan1280 ? "4xs" : "2xl"}
                fontSize={["md", "xl", "xl", "md"]}
                noOfLines={[3, 2, 2]}
                casing={"capitalize"}
                cursor="pointer"
                bgGradient="linear(to-l, #00ff87, #60efff)"
                // bgGradient="radial-gradient(circle, #ff1b6b 0%, #45caff 100%);"
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

          <Text py={"2"} fontSize={"12px"} color="#fff">
            {data.createdAt &&
              formatDistance(new Date(data.createdAt), new Date(), {
                addSuffix: true,
              })}
          </Text>
        </Box>
      </Box>
    </motion.div>
  );
}
