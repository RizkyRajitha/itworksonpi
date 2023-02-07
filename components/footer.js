import {
  Box,
  chakra,
  Container,
  Spacer,
  Stack,
  Text,
  useColorModeValue,
  VisuallyHidden,
} from "@chakra-ui/react";
import "@fontsource/vt323";

// import { FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";

// const SocialButton = ({ children, label, href }) => {
//   return (
//     <chakra.button
//       bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
//       rounded={"full"}
//       w={8}
//       h={8}
//       cursor={"pointer"}
//       as={"a"}
//       href={href}
//       display={"inline-flex"}
//       alignItems={"center"}
//       justifyContent={"center"}
//       transition={"background 0.3s ease"}
//       _hover={{
//         bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
//       }}
//     >
//       <VisuallyHidden>{label}</VisuallyHidden>
//       {children}
//     </chakra.button>
//   );
// };

export default function Footer() {
  return (
    <Box
      bg={useColorModeValue("gray.100", "gray.800")}
      color={useColorModeValue("gray.700", "gray.100")}
    >
      <Container
        as={Stack}
        maxW={"8xl"}
        py={[0, 0, 0, 0, 4]}
        direction={["column", "row", "row", "row", "row"]}
        spacing={4}
        justifyContent={[
          "center",
          "space-between",
          "space-between",
          "space-between",
          "space-between",
        ]}
        alignItems={["center", "baseline", "baseline", "baseline", "baseline"]}
      >
        <Text fontFamily={"VT323"} fontSize="4xl" textAlign={"center"}>
          CodeHiRise
        </Text>
        <Spacer />
        <Text>All rights reserved {new Date().getFullYear()}</Text>
        {/* <Stack direction={"row"} spacing={6}> */}
        {/* <SocialButton label={"Twitter"} href={"#"}>
            <FaTwitter />
          </SocialButton>
          <SocialButton label={"YouTube"} href={"#"}>
            <FaYoutube />
          </SocialButton>
          <SocialButton label={"Instagram"} href={"#"}>
            <FaInstagram />
          </SocialButton> */}
      </Container>
    </Box>
  );
}
