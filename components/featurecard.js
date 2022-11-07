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
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        key={index}
        mb="5"
        p="3"
        mx={isLargerThan1280 ? '0':'5'}
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <NextLink
            href={`/post/${data.name.toLowerCase().replaceAll(" ", "-")}`}
          >
            <Text
              fontSize={isLargerThan1280 ? "4xs" : "2xl"}
              noOfLines={2}
              casing={"capitalize"}
              cursor="pointer"
              bgGradient="linear(to-l, #4ECDC4,  #1CB5E0)"
              bgClip="text"
            >
              <Link>{data.name}</Link>
            </Text>
          </NextLink>
          <Spacer />
        </Box>

        <Text py={"2"} fontSize={"12px"}>
          {data.createdAt &&
            formatDistance(new Date(data.createdAt), new Date(), {
              addSuffix: true,
            })}
        </Text>
      </Box>
    </motion.div>
  );
}
