import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
          borderRadius: 40,
        }}
      >
        <span
          style={{
            color: "#fff",
            fontSize: 96,
            fontWeight: 700,
            fontFamily: "serif",
          }}
        >
          B
        </span>
      </div>
    ),
    { ...size }
  );
}
