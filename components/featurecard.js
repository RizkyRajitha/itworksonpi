import { Box, Link, Spacer, Tag, Text } from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import NextLink from "next/link";
import { motion } from "framer-motion";

export default function FeatureCard({ data, index }) {
  return (
    <motion.div whileHover={{ scale: 1.1 }} transition={{ duration: 0.2 }}>
      <Box
        maxW="xl"
        borderWidth="1px"
        borderRadius="lg"
        overflow="hidden"
        key={index}
        mb="5"
        p="3"
      >
        <Box display={"flex"} justifyContent={"space-between"}>
          <NextLink
            href={`/post/${data.name.toLowerCase().replaceAll(" ", "-")}`}
          >
            <Text
              fontSize={"4xs"}
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
