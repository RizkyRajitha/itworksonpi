import {
  Box,
  Container,
  Heading,
  Link,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spacer,
  Tag,
  Text,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/future/image";
import { getPlaiceholder } from "plaiceholder";
import { useState } from "react";
import { formatDistance } from "date-fns";
import Navbar from "../../components/navbar";
import NextLink from "next/link";
import MetaTags from "../../components/metatags";
import rehypeSlug from "rehype-slug";
import Footer from "../../components/footer";
import { motion, useScroll } from "framer-motion";

const StrapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
const PublicUrl = process.env.NEXT_PUBLIC_SITE_URL || "";

export async function getStaticPaths() {
  try {
    let res = await (await fetch(`${StrapiUrl}/api/posts`)).json();
    console.log(res.data);

    let posts = res?.data?.map((item) => {
      let slug = item.attributes.name.toLowerCase().replaceAll(" ", "-");
      console.log(slug);
      return { params: { slug: slug } };
    });
    return {
      paths: posts,
      fallback: false, // can also be true or 'blocking'
    };
  } catch (error) {
    console.log(error);
    return {
      paths: [{}],
      fallback: false, // can also be true or 'blocking'
    };
  }
}

// `getStaticPaths` requires using `getStaticProps`
export async function getStaticProps(context) {
  let res = await (await fetch(`${StrapiUrl}/api/posts?populate=*`)).json();

  let post = res.data.filter(
    (post) =>
      post.attributes.name.toLowerCase().replaceAll(" ", "-") ===
      context.params.slug
  )[0];

  // console.log(post.attributes.markdown.data[0].attributes.url);

  let text = await fetch(
    `${StrapiUrl}${post.attributes.markdown.data[0].attributes.url}`
  ).then((response) => response.text());

  let imagePlaceHolders = [];

  let imageregex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g;

  let mdximages = text.match(imageregex);

  let readTime = Math.round(text.trim().split(/\s+/).length / 183);

  // create image placeholders
  if (mdximages?.length) {
    for (let index = 0; index < mdximages.length; index++) {
      const element = mdximages[index];

      var urlregexp = /\(([^)]+)\)/;
      var matches = urlregexp.exec(element)[1];

      const { base64, img } = await getPlaiceholder(matches, { size: 32 });
      let plaiceholder = { img: img.src, base64 };
      imagePlaceHolders.push(plaiceholder);
    }
  }

  // create cover art placeholders
  // let coverArtPlaceholder = await getPlaiceholder(
  //   `${StrapiUrl}${post.attributes.coverArt.data.attributes.url}`,
  //   {
  //     size: 32,
  //   }
  // );

  // console.log(coverArtPlaceholder.base64);
  // complile mdx
  const mdxSource = await serialize(text, {
    mdxOptions: {
      remarkPlugins: [require("remark-prism")],
      rehypePlugins: [rehypeSlug],
    },
  });

  return {
    props: {
      mdxSource,
      imagePlaceHolders,
      post,
      readTime,
      // coverArtPlaceholder: coverArtPlaceholder.base64,
      slug: context.params.slug,
    },
  };
}

const CustomHeading = ({ as, id, ...props }) => {
  if (id) {
    return (
      <Link href={`#${id}`} scrollBehavior="smooth">
        {/* <NextLink href={`#${id}`} scroll={false}> */}
        <Heading
          {...props}
          as={as}
          py="4"
          id={id}
          noOfLines="1"
          lineHeight={"1em"}
          _hover={{
            _before: {
              position: "relative",
              marginLeft: "-1.2ch",
              paddingRight: "0.2ch",
            },
          }}
        />
        {/* </NextLink> */}
      </Link>
    );
  }
  return <Heading as={as} {...props} />;
};

export default function Post({
  mdxSource,
  imagePlaceHolders,
  post,
  readTime,
  // coverArtPlaceholder,
  slug,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalImage, setmodalImage] = useState({
    alt: "",
    src: "",
    placeholder: "",
  });
  // const [showCopy, setshowCopy] = useState(false);

  const [isLargerThan980] = useMediaQuery("(min-width: 980px)");
  const [isLargerThan268] = useMediaQuery("(min-width: 268px)");
  const [isLargerThan1280] = useMediaQuery("(min-width: 1280px)");

  const { scrollYProgress } = useScroll();

  const components = {
    h1: (props) => <CustomHeading fontSize="4xl" as="h1" {...props} />,
    h2: (props) => <CustomHeading fontSize="2xl" as="h2" {...props} />,
    h3: (props) => <CustomHeading fontSize="xl" as="h3" {...props} />,
    // h1: (props) => <Text as="h1" py="10" fontSize={"4xl"} {...props} />,
    // h2: (props) => <Text py="4" fontSize={"2xl"} {...props} />,
    // h3: (props) => <Text py="4" fontSize={"xl"} {...props} />,
    h4: (props) => <Text fontSize={"lg"} {...props} />,
    p: (props) => <Box textAlign={"justify"} {...props} />,
    img: (props) => {
      return (
        <Box
          display={"flex"}
          justifyContent="center"
          flexDir={"row"}
          borderRadius="lg"
          p={isLargerThan980 ? "12" : "8"}
        >
          <motion.div
            whileHover={{ scale: isLargerThan268 ? 1.06 : 1 }}
            transition={{ duration: 0.2 }}
          >
            <Box
              borderWidth="1px"
              borderRadius="lg"
              overflow={"hidden"}
              cursor={"pointer"}
            >
              {" "}
              <Image
                {...props}
                width="800"
                height={"600"}
                placeholder="blur"
                blurDataURL={
                  imagePlaceHolders.filter((img) => img.img === props.src)[0]
                    ?.base64
                }
                onClick={() => {
                  onOpen();
                  setmodalImage({
                    alt: props.alt,
                    src: props.src,
                    placeholder: imagePlaceHolders.filter(
                      (img) => img.img === props.src
                    )[0]?.base64,
                  });
                }}
              />
            </Box>
          </motion.div>
        </Box>
      );
    },
    // pre: (props) => (
    //   <Box
    //     onMouseEnter={() => {
    //       console.log("enterrrrrrr");
    //       setshowCopy(true);
    //     }}
    //     onMouseLeave={() => {
    //       console.log("leaveeeeee");
    //       setshowCopy(false);
    //     }}
    //   >
    //     <pre className={props.className}>
    //       <Box>
    //         <Button>copy</Button>
    //       </Box>
    //       {props.children}{" "}
    //     </pre>
    //   </Box>
    // ),
  };

  return (
    <>
      <MetaTags
        title={post.attributes.name}
        description={post.attributes.overview}
        image={`${PublicUrl}/api/og?title=${post.attributes.name}`}
        url={`${PublicUrl}/post/${slug}`}
      />
      <Navbar />
      <Container
        maxW={"8xl"}
        pt="10"
        minH={"82vh"}
        bg={useColorModeValue("gray.100", "gray.800")}
        color={useColorModeValue("gray.700", "gray.100")}
      >
        <Box>
          <motion.div
            style={{
              height: "1vh",
              backgroundColor: "#fff",
              scaleX: scrollYProgress,
              top: "0px",
              left: "0px",
              right: "0px",
              position: "fixed",
              transformOrigin: "0%",
              background: "linear-gradient(to left, #4ECDC4, #1CB5E0)",
            }}
          />
          <Box maxW={"100%"}>
            <Box
              display={"flex"}
              justifyContent="space-between"
              flexDirection={isLargerThan980 ? "row" : "column"}
              my="20"
            >
              <Box
                display={"flex"}
                flexDir="column"
                justifyContent={isLargerThan980 ? "space-between" : "center"}
                alignItems={isLargerThan980 ? "baseline" : "center"}
                mr="10"
                minW={isLargerThan980 ? "40%" : "100%"}
                maxW={"100%"}
                pb={isLargerThan980 ? "0" : "8"}
              >
                <Text
                  fontSize={"4xl"}
                  noOfLines={5}
                  textAlign={isLargerThan980 ? "left" : "center"}
                  casing={"capitalize"}
                  pb="2"
                  bgGradient="linear(to-br, #4ECDC4,  #1CB5E0)"
                  bgClip="text"
                  fontWeight="extrabold"
                >
                  {post.attributes.name}
                </Text>
                <Text
                  fontSize={"lg"}
                  noOfLines={2}
                  textAlign={isLargerThan980 ? "left" : "center"}
                  pb="2"
                >
                  {readTime}ish minutes read
                </Text>
                <Spacer />

                <Box py={"2"}>
                  {post?.attributes?.createdAt &&
                    formatDistance(
                      new Date(post.attributes.createdAt),
                      new Date(),
                      {
                        addSuffix: true,
                      }
                    )}
                </Box>
                <Box pt="2">
                  {post.attributes.categories.data.map((element, index) => {
                    return (
                      <Tag mr="2" key={index} colorScheme="green">
                        <NextLink href={`/category/${element.attributes.name}`}>
                          <Text
                            casing={"capitalize"}
                            as="a"
                            cursor={"pointer"}
                            m="2"
                          >
                            {element.attributes.name}
                          </Text>
                        </NextLink>
                      </Tag>
                    );
                  })}
                </Box>
              </Box>
              <Spacer />
              <Box
                borderRadius="lg"
                overflow={"hidden"}
                minW="40%"
                // bgGradient="linear(to-br, #009FFF,  #ec2F4B)"
                bgGradient="linear(to-br, #4ECDC4,  #1CB5E0)"
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
              >
                <Box
                  borderRadius="lg"
                  overflow={"hidden"}
                  p={isLargerThan268 ? "10" : "2"}
                  bgGradient="linear(to-br, #4ECDC4,  #1CB5E0)"
                >
                  <motion.div
                    whileHover={{ scale: isLargerThan268 ? 1.06 : 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Image
                      width={1200}
                      height={630}
                      placeholder="blur"
                      blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAANCAIAAABHKvtLAAAACXBIWXMAAAsTAAALEwEAmpwYAAADlklEQVR4nGPgl1AlEnEIyIvJapvZeDDyyAhKqhOpi4EYRUKSaoxcMgmpRRW1ndPnLI1JymXkkhGS0iTBAkFJdWSEJigkpcktomRu693WPSUoItXK3odbWFFIShNNF6YJUAt4RZUYOKW5hRVBSESJW1iRV1RJUFKdW1iRlV8WwgUp5ZTiEJAHKWaXhCjjEJBn45fnE1PhEJDnEVWGqOQQApmDsIBDQF5dz6ahdYKKtqWKpoW8qomihpm0kgG3sKKsinFIVJqVvbeEop6YrLaIjEZgWLKSpoW0koGytqWCmom6gY2OiSO/mIqdS6CytqWihpmcqpGqjrWytiWfmArUAkYeGRsn/6UrN82Yt3z5mi1nz1+/dutBSESqlKL+3IWraxt7Kuu7VqzdtnzNlqWrNm/dfUhO1Sg+OX/5mi0Hjp7df/j0hKnz1m/eXVHfWVHbuWj5+pOnL6/buKujdwYokiTVQBZwCyuq6lg7uofGJxd4BcSW1bRVNXQbWboKSWrkFtfnFtVl5Fam5VTUNIBsyi2qE5fXdXAPLqtpKypvKqtps7D1Co1KS8kqS80pzymqLa1qTckqS8up4BCQh8QEKA74xFR4RZXY+OVZ+WUZGCUYGMQgocnAIsHALgUiWSQZOKUZuWQYOKVZ+WUZeWRAImBlfGKqDAyiDJxSIFkGcQYGMQZ2SQZ2SXg8gywQktJkYJds6pgcn1qoZ+bsF5qgqmMloajv6R9jYOZc29SXlFHCLawoLqtTVNEcFZ9l7einb+Hq5BmakF7kExRvau3p4B5sZOnq6R/j6R/j5hNpauPFLayI8AHEgulzlrZ2T9t/+PTpc9f1TB31zJzevP929caDb7//7z98WlJez8kz9OyFaz///D907NymbfuevXrfP2VuS9eUC5duXbp6++iJC89evt9z8NT0OcvXbtzJwCIJySggCwQl1bmElawd/QzMnN18Ihzdg7lFlERktEytPS3sfazsva0dfXlFleRUjdx9o+xcAlS0rYwt3QzMXBzcgh3cgjz9Y5o7JlvYeVvYelnYecupmlg7+kISNI+oMiIns/HLcwjIM3LJsPLLCkqq84mpMPPIsvLLsvHLM/PIQrILI5cMMw8oZzDzyHIIgOKMmQeknk9MBZJs5FSNZFQMwKSxnKqJjJIhwgIhSTVIpoUkL7gIcs6E515kKYgsn5iKopqZnUuAV0Csf0iiha2Xm0+EqY0XAPBrEj731S8JAAAAAElFTkSuQmCC"
                      // blurDataURL={coverArtPlaceholder}
                      alt={`${post.attributes.name} cover`}
                      layout="responsive"
                      src={`${PublicUrl}/api/og?title=${post.attributes.name}`}
                      // src={`${StrapiUrl}${post.attributes.coverArt.data.attributes.url}`}
                      style={{
                        borderRadius: "0.5rem",
                      }}
                    />
                  </motion.div>
                </Box>
              </Box>
            </Box>
            <Box
              display={"flex"}
              flexDirection={isLargerThan1280 ? "row" : "column"}
              // boxShadow={"outline"}
              justifyContent="space-between"
            >
              <Box
                // minW={isLargerThan980 ? "60%" : "100%"}
                // boxShadow={"outline"}
                mb="10"
              >
                <MDXRemote {...mdxSource} components={components} />
              </Box>
              <Box
                // boxShadow={"outline"}
                my="5"
                minW={isLargerThan980 ? "15%" : "100%"}
              >
                widgets
              </Box>
            </Box>
          </Box>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose} size="full">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody display={"flex"}>
              <Box
                display={"flex"}
                flexDirection="column"
                justifyContent="center"
                p={isLargerThan268 ? "8" : "1"}
                minW={"100%"}
              >
                <Box>
                  <Image
                    src={modalImage.src}
                    alt={modalImage.alt}
                    width="1920"
                    height={"1080"}
                    placeholder="blur"
                    blurDataURL={modalImage.placeholder}
                  />
                  <Box textAlign={"center"}>
                    <Text pt="4">{modalImage.alt}</Text>
                  </Box>
                </Box>
              </Box>
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
      <Footer />
    </>
  );
}
