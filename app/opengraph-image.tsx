import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "Bekleriz — Online Davetiye Platformu";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage:
            "linear-gradient(145deg, #06000f 0%, #0d0120 50%, #080014 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Blob sol üst */}
        <div
          style={{
            position: "absolute",
            top: -120,
            left: -120,
            width: 560,
            height: 560,
            borderRadius: "50%",
            backgroundImage:
              "radial-gradient(circle, rgba(109,40,217,0.45) 0%, transparent 70%)",
            display: "flex",
          }}
        />
        {/* Blob sağ alt */}
        <div
          style={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 440,
            height: 440,
            borderRadius: "50%",
            backgroundImage:
              "radial-gradient(circle, rgba(219,39,119,0.35) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Logo satırı */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 18,
            marginBottom: 44,
          }}
        >
          <div
            style={{
              width: 64,
              height: 64,
              borderRadius: 18,
              backgroundImage:
                "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 34,
              fontWeight: 700,
              color: "#fff",
              fontFamily: "serif",
            }}
          >
            B
          </div>
          <span
            style={{
              fontSize: 48,
              fontWeight: 600,
              color: "#fff",
              fontFamily: "serif",
              letterSpacing: "-0.5px",
            }}
          >
            Bekleriz
          </span>
        </div>

        {/* Başlık */}
        <div
          style={{
            fontSize: 68,
            fontWeight: 800,
            color: "#fff",
            textAlign: "center",
            lineHeight: 1.1,
            marginBottom: 24,
            maxWidth: 860,
            fontFamily: "sans-serif",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
          }}
        >
          Online Davetiye Platformu
        </div>

        {/* Alt yazı */}
        <div
          style={{
            fontSize: 28,
            color: "rgba(196,132,252,0.9)",
            textAlign: "center",
            maxWidth: 680,
            lineHeight: 1.5,
            fontFamily: "sans-serif",
            display: "flex",
          }}
        >
          Düğün, nişan ve doğum günü davetiyeleri — dakikalar içinde hazır
        </div>

        {/* Etiketler */}
        <div
          style={{
            display: "flex",
            gap: 16,
            marginTop: 52,
          }}
        >
          {["💍 Düğün", "💌 Nişan", "🎂 Doğum Günü", "📱 WhatsApp"].map(
            (tag) => (
              <div
                key={tag}
                style={{
                  padding: "10px 22px",
                  borderRadius: 999,
                  background: "rgba(255,255,255,0.08)",
                  border: "1px solid rgba(255,255,255,0.15)",
                  color: "rgba(255,255,255,0.72)",
                  fontSize: 20,
                  fontFamily: "sans-serif",
                  display: "flex",
                }}
              >
                {tag}
              </div>
            )
          )}
        </div>
      </div>
    ),
    { ...size }
  );
}
