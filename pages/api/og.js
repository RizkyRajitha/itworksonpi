import { ImageResponse } from "@vercel/og";
import Image from "next/future/image";

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
    : "CodeHiRise";

  // console.log(title);

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
            display: "flex",
            width: "100%",
            justifyContent: "space-between",
            padding: "10px",
          }}
        >
          <img
            style={{ alignSelf: "center" }}
            width="100"
            src={"https://codehirise.com/images/codehiriselogo.png"}
            alt="logo"
          />
          <div
            style={{
              fontSize: 36,
              height: "10vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
              alignSelf: "center",
              // paddingRight: "10px",
            }}
          >
            CodeHiRise
          </div>
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
