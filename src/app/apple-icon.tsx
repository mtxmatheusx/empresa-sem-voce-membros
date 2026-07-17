import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#FAFAF7",
          fontFamily: "serif",
          fontStyle: "italic",
          fontWeight: 900,
          fontSize: 160,
          color: "#B8902A",
          letterSpacing: "-0.06em",
          lineHeight: 0.85,
          paddingBottom: 10,
        }}
      >
        M
      </div>
    ),
    { ...size }
  );
}
