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
  Tooltip,
  useColorModeValue,
  useDisclosure,
  useMediaQuery,
} from "@chakra-ui/react";
import { serialize } from "next-mdx-remote/serialize";
import { MDXRemote } from "next-mdx-remote";
import Image from "next/future/image";
import { getPlaiceholder } from "plaiceholder";
import { useState } from "react";
import { format, formatDistance, parseISO } from "date-fns";
import Navbar from "../../components/navbar";
import NextLink from "next/link";
import MetaTags from "../../components/metatags";
import rehypeSlug from "rehype-slug";
import Footer from "../../components/footer";
import { motion, useScroll } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFacebookSquare,
  faRedditSquare,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";
import { Icon } from "@chakra-ui/react";

const StrapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
const PublicUrl = process.env.NEXT_PUBLIC_SITE_URL || "";
const VERCEL_ENV = process.env.VERCEL_ENV || "dev";
const CommitSha = process.env.VERCEL_GIT_COMMIT_SHA || "9977";

export async function getStaticPaths() {
  try {
    let res = await (await fetch(`${StrapiUrl}/api/posts`)).json();
    // console.log(res.data);

    console.log(`VERCEL_GIT_COMMIT_SHA : ${CommitSha}`);

    let posts = res?.data
      .filter((ele) =>
        VERCEL_ENV === "production" ? ele.attributes.publish : true
      )
      .map((item) => {
        return { params: { slug: item.attributes.slug } };
      });
    // console.log(posts);

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
    (post) => post.attributes.slug === context.params.slug
  )[0];

  // console.log(post.attributes.markdown.data[0].attributes.url);

  let text = await fetch(
    `${StrapiUrl}${post.attributes.markdown.data[0].attributes.url}`
  ).then((response) => response.text());

  let imagePlaceHolders = [];

  let imageregex = /!\[[^\]]*\]\((.*?)\s*("(?:.*[^"])")?\s*\)/g;

  let mdximages = text.match(imageregex);

  let readTime = Math.round(text.trim().split(/\s+/).length / 183);
  let coverArtPlaceholder = "";

  try {
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
    console.log(
      `cover art - - - ${PublicUrl}/api/og?title=${encodeURIComponent(
        post.attributes.name
      )}&id=${new Date().CommitSha}`
    );
    // create cover art placeholders
    coverArtPlaceholder = await getPlaiceholder(
      // `${StrapiUrl}${post.attributes.coverArt.data.attributes.url}`,
      `${PublicUrl}/api/og?title=${encodeURIComponent(
        post.attributes.name
      )}&id=${new Date().CommitSha}`,
      {
        size: 32,
      }
    );
  } catch (error) {
    console.log(error);
  }

  // console.log(coverArtPlaceholder.base64);
  // console.log(imagePlaceHolders);
  // complile mdx
  const mdxSource = await serialize(text, {
    mdxOptions: {
      remarkPlugins: [require("remark-prism")],
      rehypePlugins: [rehypeSlug],
    },
  });
  // console.log(mdxSource.compiledSource);
  return {
    props: {
      mdxSource,
      imagePlaceHolders,
      post,
      readTime,
      coverArtPlaceholder: coverArtPlaceholder.base64,
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
  coverArtPlaceholder,
  slug,
}) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [modalImage, setmodalImage] = useState({
    alt: "",
    src: "",
    placeholder: "",
  });
  // const [showCopy, setshowCopy] = useState(false);

  const [isLargerThan268] = useMediaQuery("(min-width: 268px)");

  const { scrollYProgress } = useScroll();

  const components = {
    h1: (props) => <CustomHeading fontSize="4xl" as="h1" {...props} />,
    h2: (props) => <CustomHeading fontSize="2xl" as="h2" {...props} />,
    h3: (props) => <CustomHeading fontSize="xl" as="h3" {...props} />,
    h4: (props) => <Text as="h4" fontSize={"lg"} {...props} />,
    p: (props) => {
      // console.log(props.children?.type);
      if (props.children?.type === "img") {
        return (
          <Box
            display={"flex"}
            justifyContent="center"
            flexDir={"row"}
            borderRadius="lg"
            p={[8, 8, 12]}
          >
            <motion.div
              whileHover={{ scale: isLargerThan268 ? 1.06 : 1 }}
              transition={{ duration: 0.15 }}
            >
              <Box
                borderWidth="1px"
                borderRadius="lg"
                overflow={"hidden"}
                cursor={"pointer"}
              >
                {" "}
                <Image
                  {...props.children.props}
                  alt={props.children.props.alt}
                  width="800"
                  height={"600"}
                  placeholder="blur"
                  blurDataURL={
                    imagePlaceHolders.filter(
                      (img) => img.img === props.children.props.src
                    )[0]?.base64
                  }
                  loading="lazy"
                  onClick={() => {
                    onOpen();
                    setmodalImage({
                      alt: props.children.props.alt,
                      src: props.children.props.src,
                      placeholder: imagePlaceHolders.filter(
                        (img) => img.img === props.children.props.src
                      )[0]?.base64,
                    });
                  }}
                />
              </Box>
            </motion.div>
          </Box>
        );
      } else {
        return <Box as={"p"} textAlign={"justify"} {...props} />;
      }
    },
    // p: (props) => <Box as={"p"} textAlign={"justify"} {...props} />,
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
              flexDirection={["column", "column", "column", "row"]}
              my="20"
            >
              <Box
                display={"flex"}
                flexDir="column"
                justifyContent={["center", "center", "center", "space-between"]}
                alignItems={["center", "center", "center", "baseline"]}
                mr="10"
                minW={["100%", "100%", "100%", "20%"]}
                maxW={"100%"}
                pb={[8, 8, 8, 0]}
              >
                <Text
                  fontSize={"4xl"}
                  noOfLines={5}
                  textAlign={["center", "center", "center", "left"]}
                  casing={"capitalize"}
                  pb="2"
                  bgGradient={useColorModeValue(
                    "linear(to-br, #4ECDC4,  #1CB5E0)",
                    "linear(to-br, #4ECDC4,  #1CB5E0)"
                  )}
                  bgClip="text"
                  fontWeight="extrabold"
                  as="h1"
                >
                  {post.attributes.name}
                </Text>
                <Text
                  fontSize={"lg"}
                  noOfLines={2}
                  textAlign={["center", "center", "center", "left"]}
                  pb="2"
                >
                  {readTime}ish minutes read
                </Text>

                <Box textAlign={"center"}>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`https://twitter.com/intent/tweet?text=${post.attributes.name}&url=${PublicUrl}/post/${post.attributes.slug}&hashtags=cloud,web,freeservices`}
                  >
                    <Icon
                      viewBox="0 0 200 200"
                      mr="1"
                      fontSize={"2.5em"}
                      color="#009FFF"
                    >
                      <FontAwesomeIcon icon={faTwitterSquare} color="#009FFF" />
                    </Icon>
                  </Link>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`http://www.reddit.com/submit?url=${PublicUrl}/post/${post.attributes.slug}&title=${post.attributes.name}`}
                  >
                    <Icon
                      viewBox="0 0 200 200"
                      m="1"
                      fontSize={"2.5em"}
                      color="#0b82e7"
                    >
                      <FontAwesomeIcon icon={faRedditSquare} color="#FF5700" />
                    </Icon>
                  </Link>
                  <Link
                    target="_blank"
                    rel="noreferrer"
                    href={`https://www.facebook.com/sharer/sharer.php?u=${PublicUrl}/post/${post.attributes.slug}`}
                  >
                    <Icon
                      viewBox="0 0 200 200"
                      m="1"
                      fontSize={"2.5em"}
                      color="#0b82e7"
                    >
                      <FontAwesomeIcon icon={faFacebookSquare} />
                    </Icon>

                    {/* <FontAwesomeIcon
                        icon={faFacebookSquare}
                        color="#0b82e7"
                      /> */}
                    {/* </Box> */}
                    {/* <Icon
                      as={
                        <FontAwesomeIcon
                          icon={faFacebookSquare}
                          color="#0b82e7"
                          size="2x"
                        />
                      }
                    /> */}

                    {/* <FontAwesomeIcon
                      icon={faFacebookSquare}
                      color="#0b82e7"
                      size="2x"
                    /> */}
                  </Link>
                </Box>

                <Spacer />
                <Box py={"2"}>
                  <Tooltip
                    label={`${format(
                      parseISO(post?.attributes?.createdAt),
                      "HH:MM MM/dd/yyyy"
                    )}`}
                    aria-label="Time"
                  >
                    <time
                      dateTime={`${format(
                        parseISO(post?.attributes?.createdAt),
                        "yyyy-MM-dd HH:MM:SS"
                      )}`}
                    >
                      {post?.attributes?.createdAt &&
                        formatDistance(
                          new Date(post.attributes.createdAt),
                          new Date(),
                          {
                            addSuffix: true,
                          }
                        )}
                    </time>
                  </Tooltip>
                </Box>
                <Box
                  pt="2"
                  textAlign={["center", "center", "center", "left", "left"]}
                >
                  {[...post.attributes.categories.data].map(
                    (element, index) => {
                      return (
                        <NextLink
                          href={`/category/${element.attributes.name}`}
                          key={index}
                          passHref
                        >
                          <Tag
                            mt="2"
                            mr="2"
                            colorScheme="green"
                            cursor={"pointer"}
                            as="a"
                            p="2"
                          >
                            <Text casing={"capitalize"} as="span">
                              {element.attributes.name}
                            </Text>
                          </Tag>
                        </NextLink>
                      );
                    }
                  )}
                </Box>
              </Box>
              <Spacer />
              <Box
                borderRadius="lg"
                overflow={"hidden"}
                minW="40%"
                // bgGradient="linear(to-br, #009FFF,  #ec2F4B)"
                // bgGradient="linear(to-br, #4ECDC4,  #1CB5E0)"
                display={"flex"}
                justifyContent="center"
                alignItems={"center"}
              >
                <Box>
                  <Box
                    borderRadius="lg"
                    overflow={"hidden"}
                    p={[4, 6, 6, 8]}
                    bgGradient="linear(to-br, #4ECDC4,  #1CB5E0)"
                  >
                    <motion.div
                      // whileHover={{ scaleX: isLargerThan268 ? 1.06 : 1 }}
                      whileHover={{ scaleX: 1.06, scaleY: 1.115 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Image
                        width={1200}
                        height={630}
                        placeholder="blur"
                        blurDataURL={coverArtPlaceholder}
                        alt={`${post.attributes.name} cover`}
                        layout="responsive"
                        src={`${PublicUrl}/api/og?title=${post.attributes.name}`}
                        style={{
                          borderRadius: "0.5rem",
                        }}
                      />
                    </motion.div>
                  </Box>
                </Box>
              </Box>
            </Box>
            <Box
              display={"flex"}
              flexDirection={["column", "column", "column", "column", "row"]}
              // boxShadow={"outline"}
              justifyContent="space-between"
            >
              <Box
                // boxShadow={"outline"}
                minW={["100%", "100%", "100%", "85%"]}
                mb="10"
              >
                <MDXRemote {...mdxSource} components={components} />
              </Box>
              <Box
                // boxShadow={"outline"}
                my={["6", "6", "6", "0"]}
                minW={["100%", "100%", "100%", "15%"]}
              >
                {/* widgets */}
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
                p={[0, 2, 3, 4, 6]}
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
