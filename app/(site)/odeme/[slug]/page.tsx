import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { SABLONLAR } from "@/lib/sablonlar";
import { davetiyeFiyatiHesapla, tutarMetni, type DavetiyeFiyatSonucu } from "@/lib/davetiye-fiyatlandirma";
import OdemeCheckoutForm from "@/components/OdemeCheckoutForm";

export const metadata: Metadata = { robots: { index: false, follow: false } };

interface Props {
  params: Promise<{ slug: string }>;
}

const EMOJILER: Record<string, string> = {
  dugun: "💒", nisan: "💍", dogumgunu: "🎂", sunnet: "⭐", kina: "🕯️", kurumsal: "🏢", diger: "🎉",
};

const ETIKETLER: Record<string, string> = {
  dugun: "Düğün", nisan: "Nişan", dogumgunu: "Doğum Günü",
  sunnet: "Sünnet", kina: "Kına", kurumsal: "Kurumsal", diger: "Diğer",
};

const KALEM_IKONU: Record<string, string> = {
  "temel-davetiye": "✉️",
  "luks-sablon": "✨",
  "muzik": "🎵",
  "album-ani": "📸",
  "sesli-ani": "🎙️",
  "canli-duvar": "🖼️",
  "oturma-plani": "🪑",
};

export default async function OdemeCheckoutPage({ params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) redirect("/giris");

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, user: { email: session.user.email } },
    select: {
      id: true,
      baslik: true,
      etkinlikTur: true,
      tarih: true,
      mekan: true,
      sablon: true,
      muzik: true,
      albumAktif: true,
      sesliAniAktif: true,
      canliDuvarAktif: true,
      oturmaPlanAktif: true,
      odemeDurumu: true,
      fiyatSnapshot: true,
    },
  });

  if (!davetiye) notFound();
  if (davetiye.odemeDurumu === "odendi") redirect(`/dashboard/davetiye/${slug}`);

  const sablon = SABLONLAR.find(s => s.id === davetiye.sablon) ?? SABLONLAR[0];
  const renk = sablon.renk;
  const emoji = EMOJILER[davetiye.etkinlikTur] ?? "🎉";
  const etiket = ETIKETLER[davetiye.etkinlikTur] ?? "Etkinlik";

  const fiyatSnapshot = davetiye.fiyatSnapshot as DavetiyeFiyatSonucu | null;
  const fiyat = fiyatSnapshot ?? davetiyeFiyatiHesapla({
    sablon: davetiye.sablon,
    muzik: davetiye.muzik,
    albumAktif: davetiye.albumAktif,
    sesliAniAktif: davetiye.sesliAniAktif,
    canliDuvarAktif: davetiye.canliDuvarAktif,
    oturmaPlanAktif: davetiye.oturmaPlanAktif,
  });

  const tarihStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })
    : null;

  return (
    <>
      <style>{`
        @keyframes co-orb {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(35px,-25px) scale(1.06); }
          66%       { transform: translate(-18px,18px) scale(0.96); }
        }
        @keyframes co-up {
          from { opacity: 0; transform: translateY(22px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(148deg, #05000d 0%, #0c0120 55%, #07000f 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Glowing orbs */}
        <div style={{
          position: "absolute", top: "-5%", left: "-8%",
          width: 700, height: 700, borderRadius: "50%",
          background: `radial-gradient(circle, ${renk}2e 0%, transparent 62%)`,
          filter: "blur(90px)",
          animation: "co-orb 16s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-8%", right: "-5%",
          width: 550, height: 550, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(219,39,119,0.16) 0%, transparent 62%)",
          filter: "blur(80px)",
          animation: "co-orb 20s ease-in-out infinite reverse",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0, opacity: 0.025, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }} />

        <div style={{ position: "relative", zIndex: 2, padding: "28px 20px 64px" }}>

          {/* Header */}
          <div style={{
            maxWidth: 1040, margin: "0 auto 44px",
            display: "flex", alignItems: "center", justifyContent: "space-between",
          }}>
            <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: "linear-gradient(135deg,#7C3AED,#DB2777)",
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <span style={{ color: "#fff", fontWeight: 700, fontSize: 16 }}>D</span>
              </div>
              <span style={{ fontFamily: "var(--font-dancing),cursive", fontSize: 24, color: "#fff" }}>Bekleriz</span>
            </Link>
            <Link href={`/dashboard/davetiye/${slug}`} style={{
              fontSize: 13, color: "rgba(255,255,255,0.35)",
              textDecoration: "none", display: "flex", alignItems: "center", gap: 6,
            }}>
              ← Davetiyeye Dön
            </Link>
          </div>

          {/* Two-panel grid */}
          <div style={{
            maxWidth: 1040, margin: "0 auto",
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))",
            gap: 24, alignItems: "start",
          }}>

            {/* ── LEFT: Invitation summary ── */}
            <div style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 28, backdropFilter: "blur(28px)",
              padding: "36px 32px",
              boxShadow: "0 28px 72px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
              animation: "co-up 0.55s 0.08s both",
            }}>

              {/* Template badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 14px", borderRadius: 999, marginBottom: 26,
                background: `${renk}20`, border: `1px solid ${renk}40`,
              }}>
                <span style={{ fontSize: 15 }}>{emoji}</span>
                <span style={{
                  fontSize: 11, fontWeight: 700, letterSpacing: "0.1em",
                  textTransform: "uppercase", color: renk,
                }}>
                  {etiket} · {sablon.isim}
                </span>
              </div>

              {/* Title */}
              <h1 style={{
                fontFamily: "var(--font-dancing),cursive",
                fontSize: 44, color: "#fff", lineHeight: 1.12, marginBottom: 8,
              }}>
                {davetiye.baslik}
              </h1>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", marginBottom: 30, lineHeight: 1.6 }}>
                Davetiyeniz hazır — ödeme sonrası anında yayına alınacak.
              </p>

              {/* Date & venue */}
              {(tarihStr || davetiye.mekan) && (
                <div style={{
                  padding: "18px 20px", borderRadius: 18, marginBottom: 26,
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.07)",
                  display: "flex", flexDirection: "column", gap: 14,
                }}>
                  {tarihStr && (
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0, fontSize: 16,
                        background: `${renk}18`, border: `1px solid ${renk}28`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>📅</span>
                      <div>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginBottom: 3 }}>Tarih</p>
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", fontWeight: 600 }}>{tarihStr}</p>
                      </div>
                    </div>
                  )}
                  {davetiye.mekan && (
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0, fontSize: 16,
                        background: `${renk}18`, border: `1px solid ${renk}28`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>📍</span>
                      <div>
                        <p style={{ fontSize: 10, color: "rgba(255,255,255,0.28)", marginBottom: 3 }}>Mekan</p>
                        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.88)", fontWeight: 600 }}>{davetiye.mekan}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Price breakdown */}
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "rgba(255,255,255,0.28)", marginBottom: 12,
              }}>
                Sipariş Özeti
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {fiyat.kalemler.map(kalem => (
                  <div key={kalem.kod} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 16px", borderRadius: 13,
                    background: "rgba(255,255,255,0.04)",
                    border: "1px solid rgba(255,255,255,0.06)",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 14 }}>{KALEM_IKONU[kalem.kod] ?? "✦"}</span>
                      <span style={{ fontSize: 13, color: "rgba(255,255,255,0.68)" }}>{kalem.ad}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "rgba(255,255,255,0.9)" }}>{tutarMetni(kalem.tutar)}</span>
                  </div>
                ))}
              </div>

              {/* Total */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 20px", marginTop: 12, borderRadius: 18,
                background: `linear-gradient(135deg, ${renk}1a 0%, rgba(109,40,217,0.14) 100%)`,
                border: `1px solid ${renk}35`,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "rgba(255,255,255,0.65)" }}>Toplam</span>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#fff", letterSpacing: "-0.5px" }}>
                  {tutarMetni(fiyat.toplamTutar)}
                </span>
              </div>
            </div>

            {/* ── RIGHT: Billing form ── */}
            <div style={{
              background: "rgba(255,255,255,0.035)",
              border: "1px solid rgba(255,255,255,0.09)",
              borderRadius: 28, backdropFilter: "blur(28px)",
              padding: "36px 32px",
              boxShadow: "0 28px 72px rgba(0,0,0,0.45), inset 0 1px 0 rgba(255,255,255,0.08)",
              animation: "co-up 0.55s 0.22s both",
            }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "rgba(168,85,247,0.65)", marginBottom: 8,
              }}>
                Güvenli Ödeme
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#fff", marginBottom: 6 }}>Fatura Bilgileri</h2>
              <p style={{ fontSize: 13, color: "rgba(255,255,255,0.32)", marginBottom: 26, lineHeight: 1.6 }}>
                Faturanız kayıtlı e-posta adresinize gönderilecektir.
              </p>

              <OdemeCheckoutForm davetiyeId={davetiye.id} />

              {/* Trust signals */}
              <div style={{
                display: "flex", justifyContent: "center", gap: 20,
                flexWrap: "wrap", marginTop: 22,
              }}>
                {["🔒 SSL Şifreli", "✅ iyzico", "💳 3D Secure"].map(r => (
                  <span key={r} style={{ fontSize: 11, color: "rgba(255,255,255,0.2)" }}>{r}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
