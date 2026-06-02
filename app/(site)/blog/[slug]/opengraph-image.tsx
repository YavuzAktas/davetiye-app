import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const CATEGORY_COLORS: Record<string, string> = {
  "Rehber": "#7c3aed",
  "İpucu":  "#db2777",
  "İlham":  "#d97706",
};

export default async function Image(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);

  const title   = post?.title       ?? "Bekleriz Blog";
  const category = post?.category   ?? "Rehber";
  const color    = CATEGORY_COLORS[category] ?? "#7c3aed";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "flex-end",
          backgroundImage: "linear-gradient(145deg, #06000f 0%, #0d0120 60%, #080014 100%)",
          position: "relative",
          overflow: "hidden",
          padding: "64px 72px",
        }}
      >
        {/* Blob sol üst */}
        <div style={{
          position: "absolute", top: -100, left: -100,
          width: 500, height: 500, borderRadius: "50%",
          backgroundImage: `radial-gradient(circle, ${color}44 0%, transparent 70%)`,
          display: "flex",
        }} />
        {/* Blob sağ alt */}
        <div style={{
          position: "absolute", bottom: -80, right: -80,
          width: 380, height: 380, borderRadius: "50%",
          backgroundImage: "radial-gradient(circle, rgba(219,39,119,0.25) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Kategori badge */}
        <div style={{
          display: "flex", alignItems: "center", marginBottom: 28,
        }}>
          <div style={{
            background: `${color}22`, border: `1px solid ${color}55`,
            color, fontSize: 18, fontWeight: 700,
            padding: "8px 20px", borderRadius: 999, fontFamily: "sans-serif",
            display: "flex",
          }}>
            {category}
          </div>
        </div>

        {/* Başlık */}
        <div style={{
          fontSize: title.length > 60 ? 48 : 58,
          fontWeight: 800,
          color: "#fff",
          lineHeight: 1.2,
          marginBottom: 32,
          maxWidth: 960,
          fontFamily: "sans-serif",
          display: "flex",
          flexWrap: "wrap",
        }}>
          {title}
        </div>

        {/* Alt bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderTop: "1px solid rgba(255,255,255,0.12)", paddingTop: 28,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{
              width: 44, height: 44, borderRadius: 12,
              backgroundImage: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 22, fontWeight: 700, color: "#fff", fontFamily: "serif",
            }}>
              B
            </div>
            <span style={{ fontSize: 26, fontWeight: 600, color: "#fff", fontFamily: "serif" }}>
              Bekleriz
            </span>
          </div>
          <span style={{ fontSize: 20, color: "rgba(255,255,255,0.4)", fontFamily: "sans-serif", display: "flex" }}>
            bekleriz.com/blog
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
