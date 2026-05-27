import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const ETKINLIK_EMOJI: Record<string, string> = {
  dugun: "💒", nisan: "💍", dogumgunu: "🎂",
  sunnet: "⭐", kina: "🕯️", kurumsal: "🏢", diger: "🎉",
};

const ETKINLIK_ETIKET: Record<string, string> = {
  dugun: "Düğün Davetiyesi", nisan: "Nişan Davetiyesi",
  dogumgunu: "Doğum Günü Davetiyesi", sunnet: "Sünnet Davetiyesi",
  kina: "Kına Davetiyesi", kurumsal: "Etkinlik Davetiyesi", diger: "Davetiye",
};

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;

  const davetiye = await prisma.davetiye.findUnique({
    where: { slug },
    select: { baslik: true, etkinlikTur: true, tarih: true, mekan: true, kisi1: true, kisi2: true },
  });

  const baslik = davetiye?.baslik ?? "Davetiye";
  const emoji = ETKINLIK_EMOJI[davetiye?.etkinlikTur ?? ""] ?? "🎉";
  const etiket = ETKINLIK_ETIKET[davetiye?.etkinlikTur ?? ""] ?? "Davetiye";

  const tarihStr = davetiye?.tarih
    ? new Date(davetiye.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" })
    : null;

  const altBilgi = [tarihStr, davetiye?.mekan].filter(Boolean).join("  ·  ");

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
          background: "linear-gradient(145deg, #06000f 0%, #0d0120 55%, #080014 100%)",
          position: "relative",
          overflow: "hidden",
          padding: "60px 80px",
        }}
      >
        {/* Arka plan blob'ları */}
        <div style={{
          position: "absolute", top: -140, left: -140,
          width: 580, height: 580, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(109,40,217,0.5) 0%, transparent 70%)",
          display: "flex",
        }} />
        <div style={{
          position: "absolute", bottom: -100, right: -100,
          width: 480, height: 480, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(219,39,119,0.38) 0%, transparent 70%)",
          display: "flex",
        }} />

        {/* Etkinlik rozeti */}
        <div style={{
          display: "flex", alignItems: "center", gap: 12,
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.16)",
          borderRadius: 999, padding: "10px 28px",
          marginBottom: 40,
        }}>
          <span style={{ fontSize: 28 }}>{emoji}</span>
          <span style={{ fontSize: 22, color: "rgba(196,132,252,0.9)", fontFamily: "sans-serif", letterSpacing: "0.08em" }}>
            {etiket}
          </span>
        </div>

        {/* Davetiye başlığı */}
        <div style={{
          fontSize: baslik.length > 30 ? 62 : 78,
          fontWeight: 800,
          color: "#fff",
          textAlign: "center",
          lineHeight: 1.12,
          maxWidth: 960,
          fontFamily: "serif",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          marginBottom: 32,
        }}>
          {baslik}
        </div>

        {/* Tarih & mekan */}
        {altBilgi && (
          <div style={{
            fontSize: 26, color: "rgba(255,255,255,0.5)",
            fontFamily: "sans-serif", display: "flex",
            marginBottom: 48,
          }}>
            {altBilgi}
          </div>
        )}

        {/* Ayırıcı çizgi */}
        <div style={{
          width: 80, height: 1,
          background: "rgba(196,132,252,0.4)",
          marginBottom: 36, display: "flex",
        }} />

        {/* Bekleriz logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: "linear-gradient(135deg, #7C3AED 0%, #DB2777 100%)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 24, fontWeight: 700, color: "#fff", fontFamily: "serif",
          }}>
            B
          </div>
          <span style={{ fontSize: 30, color: "rgba(255,255,255,0.55)", fontFamily: "serif" }}>
            Bekleriz
          </span>
        </div>
      </div>
    ),
    { ...size }
  );
}
