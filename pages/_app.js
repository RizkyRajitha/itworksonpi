import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import { Global, css } from "@emotion/react";

const theme = extendTheme({
  config: { initialColorMode: "dark", useSystemColorMode: false },
  fonts: {
    body: `'Inter Tight', sans-serif`,
  },
});

// // add code syntax highlights
// const GlobalStyle = ({ children }) => {
//   return (
//     <>
//       <Global
//         styles={css`
//           pre[class*="language-"],
//           code[class*="language-"] {
//             color: #d4d4d4;
//             font-size: 15px;
//             text-shadow: none;
//             font-family: Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono",
//               "Courier New", monospace;
//             direction: ltr;
//             text-align: left;
//             white-space: pre;
//             word-spacing: normal;
//             word-break: normal;
//             line-height: 1.5;
//             -moz-tab-size: 4;
//             -o-tab-size: 4;
//             tab-size: 4;
//             -webkit-hyphens: none;
//             -moz-hyphens: none;
//             -ms-hyphens: none;
//             hyphens: none;
//           }

//           pre[class*="language-"]::selection,
//           code[class*="language-"]::selection,
//           pre[class*="language-"] *::selection,
//           code[class*="language-"] *::selection {
//             text-shadow: none;
//             background: #264f78;

//           }

//           @media print {
//             pre[class*="language-"],
//             code[class*="language-"] {
//               text-shadow: none;
//             }
//           }

//           pre[class*="language-"] {
//             padding: 1em;
//             margin: 0.5em 0;
//             overflow: auto;
//             background: #1a202c;
//             border-width: 1px;
//             border-radius: 0.3em;
//           }

//           :not(pre) > code[class*="language-"] {
//             padding: 0.1em 0.3em;
//             border-radius: 0.3em;
//             color: #db4c69;
//             background: #1a202c;
//             border-width: 1px;
//           }
//           /*********************************************************
//        * Tokens
//        */
//           .namespace {
//             opacity: 0.7;
//           }

//           .token.doctype .token.doctype-tag {
//             color: #569cd6;
//           }

//           .token.doctype .token.name {
//             color: #9cdcfe;
//           }

//           .token.comment,
//           .token.prolog {
//             color: #6a9955;
//           }

//           .token.punctuation,
//           .language-html .language-css .token.punctuation,
//           .language-html .language-javascript .token.punctuation {
//             color: #d4d4d4;
//           }

//           .token.property,
//           .token.tag,
//           .token.boolean,
//           .token.number,
//           .token.constant,
//           .token.symbol,
//           .token.inserted,
//           .token.unit {
//             color: #b5cea8;
//           }

//           .token.selector,
//           .token.attr-name,
//           .token.string,
//           .token.char,
//           .token.builtin,
//           .token.deleted {
//             color: #ce9178;
//           }

//           .language-css .token.string.url {
//             text-decoration: underline;
//           }

//           .token.operator,
//           .token.entity {
//             color: #d4d4d4;
//           }

//           .token.operator.arrow {
//             color: #569cd6;
//           }

//           .token.atrule {
//             color: #ce9178;
//           }

//           .token.atrule .token.rule {
//             color: #c586c0;
//           }

//           .token.atrule .token.url {
//             color: #9cdcfe;
//           }

//           .token.atrule .token.url .token.function {
//             color: #dcdcaa;
//           }

//           .token.atrule .token.url .token.punctuation {
//             color: #d4d4d4;
//           }

//           .token.keyword {
//             color: #569cd6;
//           }

//           .token.keyword.module,
//           .token.keyword.control-flow {
//             color: #c586c0;
//           }

//           .token.function,
//           .token.function .token.maybe-class-name {
//             color: #dcdcaa;
//           }

//           .token.regex {
//             color: #d16969;
//           }

//           .token.important {
//             color: #569cd6;
//           }

//           .token.italic {
//             font-style: italic;
//           }

//           .token.constant {
//             color: #9cdcfe;
//           }

//           .token.class-name,
//           .token.maybe-class-name {
//             color: #4ec9b0;
//           }

//           .token.console {
//             color: #9cdcfe;
//           }

//           .token.parameter {
//             color: #9cdcfe;
//           }

//           .token.interpolation {
//             color: #9cdcfe;
//           }

//           .token.punctuation.interpolation-punctuation {
//             color: #569cd6;
//           }

//           .token.boolean {
//             color: #569cd6;
//           }

//           .token.property,
//           .token.variable,
//           .token.imports .token.maybe-class-name,
//           .token.exports .token.maybe-class-name {
//             color: #9cdcfe;
//           }

//           .token.selector {
//             color: #d7ba7d;
//           }

//           .token.escape {
//             color: #d7ba7d;
//           }

//           .token.tag {
//             color: #569cd6;
//           }

//           .token.tag .token.punctuation {
//             color: #808080;
//           }

//           .token.cdata {
//             color: #808080;
//           }

//           .token.attr-name {
//             color: #9cdcfe;
//           }

//           .token.attr-value,
//           .token.attr-value .token.punctuation {
//             color: #ce9178;
//           }

//           .token.attr-value .token.punctuation.attr-equals {
//             color: #d4d4d4;
//           }

//           .token.entity {
//             color: #569cd6;
//           }

//           .token.namespace {
//             color: #4ec9b0;
//           }
//           /*********************************************************
//        * Language Specific
//        */

//           pre[class*="language-javascript"],
//           code[class*="language-javascript"],
//           pre[class*="language-jsx"],
//           code[class*="language-jsx"],
//           pre[class*="language-typescript"],
//           code[class*="language-typescript"],
//           pre[class*="language-tsx"],
//           code[class*="language-tsx"] {
//             color: #9cdcfe;
//           }

//           pre[class*="language-css"],
//           code[class*="language-css"] {
//             color: #ce9178;
//           }

//           pre[class*="language-html"],
//           code[class*="language-html"] {
//             color: #d4d4d4;
//           }

//           .language-regex .token.anchor {
//             color: #dcdcaa;
//           }

//           .language-html .token.punctuation {
//             color: #808080;
//           }
//           /*********************************************************
//        * Line highlighting
//        */
//           pre[class*="language-"] > code[class*="language-"] {
//             position: relative;
//             z-index: 1;
//           }

//           .line-highlight.line-highlight {
//             background: #f7ebc6;
//             box-shadow: inset 5px 0 0 #f7d87c;
//             z-index: 0;
//           }

//           @font-face {
//             font-family: "Inter Tight";
//             font-style: normal;
//             font-weight: 700;
//             font-display: swap;
//             src: url("https://fonts.googleapis.com/css2?family=Inter+Tight&display=swap");
//           }

//           @font-face {
//             font-family: "Noto Sans Mono";
//             font-style: normal;
//             font-weight: 700;
//             font-display: swap;
//             src: url("https://fonts.googleapis.com/css2?family=Noto+Sans+Mono&display=swap");
//           }
//         `}
//       />
//       {children}
//     </>
//   );
// };

const GlobalStyle = ({ children }) => {
  return (
    <>
      <Global
        styles={css`
          pre[class*="language-"],
          code[class*="language-"] {
            color: #d4d4d4;
            font-size: 15px;
            text-shadow: none;
            font-family: Menlo, Monaco, Consolas, "Andale Mono", "Ubuntu Mono",
              "Courier New", monospace;
            direction: ltr;
            text-align: left;
            white-space: pre;
            word-spacing: normal;
            word-break: normal;
            line-height: 1.5;
            -moz-tab-size: 4;
            -o-tab-size: 4;
            tab-size: 4;
            -webkit-hyphens: none;
            -moz-hyphens: none;
            -ms-hyphens: none;
            hyphens: none;
          }

          pre[class*="language-"]::selection,
          code[class*="language-"]::selection,
          pre[class*="language-"] *::selection,
          code[class*="language-"] *::selection {
            text-shadow: none;
            background: #264f78;
          }

          @media print {
            pre[class*="language-"],
            code[class*="language-"] {
              text-shadow: none;
            }
          }

          pre[class*="language-"] {
            padding: 1em;
            margin: 0.5em 0;
            overflow: auto;
            background: #1a202c;
            border-width: 1px;
            border-radius: 0.3em;
          }

          :not(pre) > code[class*="language-"] {
            padding: 0.1em 0.3em;
            border-radius: 0.3em;
            color: #db4c69;
            background: #1a202c;
            border-width: 1px;
          }
          /*********************************************************
       * Tokens
       */
          .namespace {
            opacity: 0.7;
          }

          .token.doctype .token.doctype-tag {
            color: #569cd6;
          }

          .token.doctype .token.name {
            color: #9cdcfe;
          }

          .token.comment,
          .token.prolog {
            color: #6a9955;
          }

          .token.punctuation,
          .language-html .language-css .token.punctuation,
          .language-html .language-javascript .token.punctuation {
            color: #d4d4d4;
          }

          .token.property,
          .token.tag,
          .token.boolean,
          .token.number,
          .token.constant,
          .token.symbol,
          .token.inserted,
          .token.unit {
            color: #b5cea8;
          }

          .token.selector,
          .token.attr-name,
          .token.string,
          .token.char,
          .token.builtin,
          .token.deleted {
            color: #ce9178;
          }

          .language-css .token.string.url {
            text-decoration: underline;
          }

          .token.operator,
          .token.entity {
            color: #d4d4d4;
          }

          .token.operator.arrow {
            color: #569cd6;
          }

          .token.atrule {
            color: #ce9178;
          }

          .token.atrule .token.rule {
            color: #c586c0;
          }

          .token.atrule .token.url {
            color: #9cdcfe;
          }

          .token.atrule .token.url .token.function {
            color: #dcdcaa;
          }

          .token.atrule .token.url .token.punctuation {
            color: #d4d4d4;
          }

          .token.keyword {
            color: #569cd6;
          }

          .token.keyword.module,
          .token.keyword.control-flow {
            color: #c586c0;
          }

          .token.function,
          .token.function .token.maybe-class-name {
            color: #dcdcaa;
          }

          .token.regex {
            color: #d16969;
          }

          .token.important {
            color: #569cd6;
          }

          .token.italic {
            font-style: italic;
          }

          .token.constant {
            color: #9cdcfe;
          }

          .token.class-name,
          .token.maybe-class-name {
            color: #4ec9b0;
          }

          .token.console {
            color: #9cdcfe;
          }

          .token.parameter {
            color: #9cdcfe;
          }

          .token.interpolation {
            color: #9cdcfe;
          }

          .token.punctuation.interpolation-punctuation {
            color: #569cd6;
          }

          .token.boolean {
            color: #569cd6;
          }

          .token.property,
          .token.variable,
          .token.imports .token.maybe-class-name,
          .token.exports .token.maybe-class-name {
            color: #9cdcfe;
          }

          .token.selector {
            color: #d7ba7d;
          }

          .token.escape {
            color: #d7ba7d;
          }

          .token.tag {
            color: #569cd6;
          }

          .token.tag .token.punctuation {
            color: #808080;
          }

          .token.cdata {
            color: #808080;
          }

          .token.attr-name {
            color: #9cdcfe;
          }

          .token.attr-value,
          .token.attr-value .token.punctuation {
            color: #ce9178;
          }

          .token.attr-value .token.punctuation.attr-equals {
            color: #d4d4d4;
          }

          .token.entity {
            color: #569cd6;
          }

          .token.namespace {
            color: #4ec9b0;
          }
          /*********************************************************
       * Language Specific
       */

          pre[class*="language-javascript"],
          code[class*="language-javascript"],
          pre[class*="language-jsx"],
          code[class*="language-jsx"],
          pre[class*="language-typescript"],
          code[class*="language-typescript"],
          pre[class*="language-tsx"],
          code[class*="language-tsx"] {
            color: #9cdcfe;
          }

          pre[class*="language-css"],
          code[class*="language-css"] {
            color: #ce9178;
          }

          pre[class*="language-html"],
          code[class*="language-html"] {
            color: #d4d4d4;
          }

          .language-regex .token.anchor {
            color: #dcdcaa;
          }

          .language-html .token.punctuation {
            color: #808080;
          }
          /*********************************************************
       * Line highlighting
       */
          pre[class*="language-"] > code[class*="language-"] {
            position: relative;
            z-index: 1;
          }

          .line-highlight.line-highlight {
            background: #f7ebc6;
            box-shadow: inset 5px 0 0 #f7d87c;
            z-index: 0;
          }

          @font-face {
            font-family: "Inter Tight";
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url("https://fonts.googleapis.com/css2?family=Inter+Tight");
          }

          @font-face {
            font-family: "Noto Sans Mono";
            font-style: normal;
            font-weight: 700;
            font-display: swap;
            src: url("https://fonts.googleapis.com/css2?family=Noto+Sans+Mono");
          }

          @font-face {
            font-family: "VT323";
            font-style: normal;
            font-weight: 400;
            font-display: swap;
            src: url("https://fonts.googleapis.com/css2?family=VT323");
          }

          ::-moz-selection {
            background-color: #1db6df;
            color: white;
          }
          ::selection {
            background-color: #1db6df;
            color: white;
          }

          body::-webkit-scrollbar {
            width: 8px;
          }

          body::-webkit-scrollbar-track {
            box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
          }

          body::-webkit-scrollbar-thumb {
            background-color: #404040;
            outline: 1px solid slategrey;
            border-radius: 3px;
          }
        `}
      />
      {children}
    </>
  );
};

function App({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
      <GlobalStyle>
        <Component {...pageProps} />
      </GlobalStyle>
    </ChakraProvider>
  );
}

export default App;
