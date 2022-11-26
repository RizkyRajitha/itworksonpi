import {
  Box,
  Flex,
  HStack,
  Link,
  IconButton,
  useDisclosure,
  useColorModeValue,
  Stack,
  Spacer,
  Input,
  FormControl,
  FormLabel,
  FormHelperText,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import LandingBanner from "../public/images/Itworksonpi.png";
import Image from "next/future/image";
import { useRouter } from "next/router";

const Links = [];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={"#"}
  >
    {children}
  </Link>
);

export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const router = useRouter();

  return (
    <Box
      // bg={"#1a202c"}
      px={4}
      // borderBottom="solid"
      // borderBottomColor={"#2D3748"}
      bg={useColorModeValue("gray.100", "gray.800")}
      color={useColorModeValue("gray.700", "gray.100")}
    >
      <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
        <IconButton
          size={"md"}
          icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
          aria-label={"Open Menu"}
          display={{ md: "none" }}
          onClick={isOpen ? onClose : onOpen}
        />
        <HStack spacing={8} alignItems={"end"}>
          <Box as={"a"} href="/">
            <Image src={LandingBanner} alt="logo" />
          </Box>
          <Spacer />
          <HStack as={"nav"} spacing={4} display={{ base: "none", md: "flex" }}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
          </HStack>
        </HStack>
        <Flex alignItems={"center"}>
          {/* <Input
            display={{ base: "none", md: "flex" }}
            placeholder="Explore..."
            _placeholder={{
              opacity: 1,
              color: useColorModeValue("gray.700", "gray.200"),
            }}
            onChange={(e) => {
              handleChange(e.target.value);
            }}
          /> */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(e.target?.search?.value);
              router.push(`/explore?text=${e.target?.search?.value}`);
            }}
          >
            <FormControl>
              <Input
                type="text"
                name="search"
                placeholder="Explore..."
                _placeholder={{
                  opacity: 1,
                  color: useColorModeValue("gray.700", "gray.200"),
                }}
              />
            </FormControl>
          </form>
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}

            <FormControl>
              <FormLabel>Email address</FormLabel>
              <Input type="email" />
              <FormHelperText>We'll never share your email.</FormHelperText>
            </FormControl>
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
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
