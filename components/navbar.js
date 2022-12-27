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
  Button,
  useColorMode,
} from "@chakra-ui/react";
import { HamburgerIcon, CloseIcon } from "@chakra-ui/icons";
import LandingBanner from "../public/images/Itworksonpi.png";
import Image from "next/future/image";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

const Links = ["explore"];

const NavLink = ({ link }) => {
  const bg = useColorModeValue("gray.200", "gray.700");

  return (
    <Link
      px={2}
      py={1}
      rounded={"md"}
      _hover={{
        textDecoration: "none",
        bg: bg,
      }}
      href={`${link}`}
    >
      {link}
    </Link>
  );
};
export default function Navbar() {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [path, setPath] = useState(null);
  const bg = useColorModeValue("gray.100", "gray.800");
  const color = useColorModeValue("gray.700", "gray.100");
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();

  useEffect(() => {
    console.log(router.pathname);
    setPath(router.pathname);
  }, [router.pathname]);

  return (
    <Box
      // bg={"#1a202c"}
      px={4}
      // borderBottom="solid"
      // borderBottomColor={"#2D3748"}
      bg={bg}
      color={color}
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
        <Flex alignItems={"center"} hidden={path === "/explore"}>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              console.log(e.target?.search?.value);
              router.push(`/explore?text=${e.target?.search?.value}`);
            }}
          >
            <Input
              display={{ base: "none", md: "flex" }}
              type="text"
              name="search"
              placeholder="Explore..."
              _placeholder={{
                opacity: 1,
                color: color,
              }}
            />
          </form>
          {/* <Button ml='4' onClick={toggleColorMode}>
            Toggle {colorMode === "light" ? "Dark" : "Light"}
          </Button> */}
        </Flex>
      </Flex>

      {isOpen ? (
        <Box pb={4} display={{ md: "none" }}>
          <Stack as={"nav"} spacing={4}>
            {Links.map((link) => (
              <NavLink key={link}>{link}</NavLink>
            ))}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                console.log(e.target?.search?.value);
                router.push(`/explore?text=${e.target?.search?.value}`);
              }}
            >
              <Input
                placeholder="Explore..."
                type="text"
                name="search"
                _placeholder={{
                  opacity: 1,
                  color: color,
                }}
              />
            </form>
          </Stack>
        </Box>
      ) : null}
    </Box>
  );
}
