import { ImageResponse } from "@vercel/og";

export const config = {
  runtime: "experimental-edge",
};
// Make sure the font exists in the specified path:
const font = fetch(
  new URL("../../public/VT323-Regular.TTF", import.meta.url)
).then((res) => res.arrayBuffer());

export default async function (req) {
  const { searchParams } = new URL(req.url);

  const fontData = await font;

  const hasTitle = searchParams.has("title");
  const title = hasTitle
    ? searchParams.get("title")?.slice(0, 100)
    : "My default title";

  console.log(title);

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          color: "#fff",
          background: "#1b202c",
          flexDirection: "column",
          width: "100%",
          height: "100vh",
          paddingLeft: "20px",
          paddingRight: "20px",
        }}
      >
        <div
          style={{
            fontSize: 128,
            width: "100%",
            height: "90vh",
            display: "flex",
            textAlign: "center",
            alignItems: "center",
            justifyContent: "center",
            paddingLeft: "20px",
            paddingRight: "20px",
            textTransform: "capitalize",
            marginTop: "5%",
            // border:'1px'
          }}
        >
          {title}
        </div>
        <div
          style={{
            fontSize: 36,
            width: "100%",
            height: "10vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            paddingLeft: "20px",
            paddingRight: "20px",
          }}
        >
          It works on pi
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
      fonts: [
        {
          name: "VT323",
          data: fontData,
          style: "normal",
        },
      ],
    }
  );
}
