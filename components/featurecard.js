import {
  Box,
  Link,
  Spacer,
  Text,
  Tooltip,
  useColorModeValue,
  useMediaQuery,
} from "@chakra-ui/react";
import { format, formatDistance, parseISO } from "date-fns";
import NextLink from "next/link";
import { motion } from "framer-motion";

export default function FeatureCard({ data, index }) {
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");

  return (
    <motion.div
      whileHover={{ scale: isLargerThan1280 ? 1.1 : 1.03 }}
      transition={{ duration: 0.14 }}
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
        bgGradient={useColorModeValue("", "linear(to-l, #7928CA, #FF0080)")}
        // bgClip={"text"}
      >
        <Box
          p="3"
          bg={useColorModeValue("gray.100", "gray.800")}
          color={useColorModeValue("gray.700", "gray.100")}
          borderRadius="lg"
        >
          <Box display={"flex"} justifyContent={"space-between"}>
            <NextLink href={`/post/${data.slug}`}>
              <Text
                // fontSize={isLargerThan1280 ? "4xs" : "2xl"}
                data-umami-event="FeatureCard"
                fontSize={["md", "xl", "xl", "md"]}
                noOfLines={[3, 2, 2]}
                casing={"capitalize"}
                cursor="pointer"
                bgGradient={useColorModeValue(
                  "linear(to-l, #DC2424,  #4A569D)",
                  "linear(to-br, #4ECDC4,  #1CB5E0)"
                )}
                // bgGradient="linear(to-l, #00ff87, #60efff)"
                // bgGradient="radial-gradient(circle, #ff1b6b 0%, #45caff 100%);"
                bgClip="text"
                _hover={{
                  textDecoration: "underline #a9b5af",
                  textDecorationStyle: "dashed",
                }}
              >
                <Link href={`/post/${data.slug}`}>{data.title}</Link>
              </Text>
            </NextLink>
            <Spacer />
          </Box>

          <Tooltip
            label={`${format(parseISO(data.date), "yyyy-MM-dd")}`}
            aria-label="Time"
          >
            <Text py={"2"} fontSize={"12px"} width="fit-content">
              {data.date &&
                formatDistance(new Date(data.date), new Date(), {
                  addSuffix: true,
                })}
            </Text>
          </Tooltip>

          {/* <Text py={"2"} fontSize={"12px"}>
            {data.createdAt &&
              formatDistance(new Date(data.createdAt), new Date(), {
                addSuffix: true,
              })}
          </Text> */}
        </Box>
      </Box>
    </motion.div>
  );
}
