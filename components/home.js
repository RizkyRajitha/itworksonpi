import { Box, Spacer, Tag, Text } from "@chakra-ui/react";

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
        <Text fontSize={"2xl"} noOfLines={1} casing={"capitalize"}>
          {data.name}
        </Text>
        <Spacer />
        {data.categories.map((element, index) => {
          return (
            <Tag m="2" key={index} colorScheme="green">
              {element}
            </Tag>
          );
        })}
      </Box>
      <Text fontSize={"xl"} noOfLines={2}>
        How not to rasberry pi How not to rasberry pi How not to not to rasberry
        pi
      </Text>
    </Box>
  );
}
