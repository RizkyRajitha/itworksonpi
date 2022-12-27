import {
  Box,
  Input,
  Link,
  Spacer,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";
import { formatDistance } from "date-fns";
import NextLink from "next/link";
import { useState } from "react";

export default function ExploreWidget({ posts }) {
  const [matches, setMatches] = useState([]);

  const handleChange = (value) => {
    if (value.length === 0) {
      setMatches([]);
      return;
    }
    let matches = posts.map((ele) => {
      if (ele?.name.match(new RegExp(value, "gi"))?.length > 0) {
        return ele.name;
      }
    });
    setMatches(matches.filter((n) => n));
  };

  return (
    <Box
      py="3"
      bg={useColorModeValue("gray.100", "gray.800")}
      color={useColorModeValue("gray.700", "gray.100")}
      borderRadius="lg"
    >
      <Box pt="2">
        <Input
          placeholder="Explore..."
          _placeholder={{
            opacity: 1,
            color: useColorModeValue("gray.700", "gray.200"),
          }}
          onChange={(e) => {
            handleChange(e.target.value);
          }}
        />
      </Box>
      <Box pt="4">
        {matches.length > 0 &&
          matches.map((ele, index) => {
            return (
              <Box
                p="3"
                my="2"
                bgColor={"#1a202c"}
                borderRadius="lg"
                borderWidth="1px"
                key={index}
              >
                <Box display={"flex"} justifyContent={"space-between"}>
                  <NextLink href={`/post/${ele.slug}`}>
                    <Text
                      fontSize={["md", "xl", "xl", "md"]}
                      noOfLines={[3, 2, 2]}
                      casing={"capitalize"}
                      cursor="pointer"
                      bgGradient="linear(to-l, #00ff87, #60efff)"
                      bgClip="text"
                      _hover={{
                        textDecoration: "underline #a9b5af",
                        textDecorationStyle: "dashed",
                      }}
                    >
                      <Link href={`/post/${ele.slug}`}>{ele}</Link>
                    </Text>
                  </NextLink>
                  <Spacer />
                </Box>
              </Box>
            );
          })}
      </Box>
    </Box>
  );
}
