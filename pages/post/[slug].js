import {
  Box,
  Container,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalOverlay,
  Spacer,
  Tag,
  Text,
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

const StrapiUrl = process.env.NEXT_PUBLIC_STRAPI_URL;
const PublicUrl = process.env.NEXT_PUBLIC_SITE_URL;

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
  let coverArtPlaceholder = await getPlaiceholder(
    `${StrapiUrl}${post.attributes.coverArt.data.attributes.url}`,
    {
      size: 32,
    }
  );

  // complile mdx
  const mdxSource = await serialize(text, {
    mdxOptions: { remarkPlugins: [require("remark-prism")] },
  });

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

  const [isLargerThan980] = useMediaQuery("(min-width: 980px)");

  const components = {
    h1: (props) => <Text fontSize={"4xl"} {...props} />,
    h2: (props) => <Text fontSize={"2xl"} {...props} />,
    h3: (props) => <Text fontSize={"xl"} {...props} />,
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
          <Box
            borderWidth="1px"
            borderRadius="lg"
            overflow={"hidden"}
            cursor={"pointer"}
          >
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
                console.log("click");
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
        image={`${StrapiUrl}${post.attributes?.coverArt?.data?.attributes?.formats?.small?.url}`}
        url={`${PublicUrl}/post/${slug}`}
      />
      <Navbar />
      <Container maxW={"container.xl"} mt="10">
        <Box>
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
                >
                  {post.attributes.name}
                </Text>
                <Text
                  fontSize={"lg"}
                  noOfLines={1}
                  textAlign={isLargerThan980 ? "left" : "center"}
                  pb="2"
                >
                  {readTime}ish minutes
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
                          <Text casing={"capitalize"} as="a" cursor={"pointer"}>
                            {element.attributes.name}
                          </Text>
                        </NextLink>
                      </Tag>
                    );
                  })}
                </Box>
              </Box>
              <Spacer />
              <Box borderRadius="lg" overflow={"hidden"} minW="40%">
                <Image
                  width={960}
                  height={540}
                  placeholder="blur"
                  blurDataURL={coverArtPlaceholder}
                  alt={`${post.attributes.name} cover`}
                  layout="responsive"
                  src={`${StrapiUrl}${post.attributes.coverArt.data.attributes.url}`}
                />
              </Box>
            </Box>
            <Box minW={isLargerThan980 ? "60%" : "100%"}>
              <MDXRemote {...mdxSource} components={components} />
            </Box>
          </Box>
          {/* <Box maxW={"15%"}>widgets</Box> */}
        </Box>

        <Modal isOpen={isOpen} onClose={onClose} size="6xl">
          <ModalOverlay />
          <ModalContent>
            <ModalCloseButton />
            <ModalBody>
              <Box
                display={"flex"}
                flexDirection="column"
                justifyContent="center"
                p="8"
                minW={"100%"}
              >
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
            </ModalBody>
          </ModalContent>
        </Modal>
      </Container>
    </>
  );
}
