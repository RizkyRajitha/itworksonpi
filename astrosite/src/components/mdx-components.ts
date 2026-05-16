import Alert from './Alert.astro';
import PostImage from './PostImage.astro';

// Mapping passed to <Content components={...} /> for MDX renderers.
// `Alert` is referenced as <Alert type="info|warning"> inside posts.
// `img` is overridden so every markdown image becomes a lightbox-trigger.
export const mdxComponents = {
  Alert,
  img: PostImage,
};
