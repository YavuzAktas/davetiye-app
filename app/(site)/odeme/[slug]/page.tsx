import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { SABLONLAR } from "@/lib/sablonlar";
import { davetiyeFiyatiHesapla, tutarMetni, type DavetiyeFiyatSonucu, DAVETIYE_FIYAT_KALEMLERI } from "@/lib/davetiye-fiyatlandirma";
import OdemeCheckoutForm from "@/components/OdemeCheckoutForm";
import OdemeUpsell, { type UpsellOzellik } from "@/components/OdemeUpsell";

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
      aniDefteriAktif: true,
      sesliAniAktif: true,
      canliDuvarAktif: true,
      oturmaPlanAktif: true,
      odemeDurumu: true,
      fiyatSnapshot: true,
    },
  });

  if (!davetiye) notFound();
  if (davetiye.odemeDurumu === "odendi") redirect(`/dashboard/davetiye/${slug}`);

  const adminMi = ["aylinyavuz@gmail.com","mehlikaalan@icloud.com"].includes(session.user.email ?? "");
  if (!adminMi) {
    return (
      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(148deg, #faf7ff 0%, #fdf4ff 55%, #f7f3ff 100%)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "24px",
      }}>
        <div style={{
          maxWidth: 440, width: "100%", textAlign: "center",
          background: "#ffffff",
          border: "1px solid #e5e7eb",
          borderRadius: 28, padding: "52px 40px",
          boxShadow: "0 4px 24px rgba(0,0,0,0.08)",
        }}>
          <div style={{ fontSize: 52, marginBottom: 20 }}>⏳</div>
          <p style={{
            fontSize: 10, fontWeight: 700, letterSpacing: "0.22em",
            textTransform: "uppercase", color: "rgba(124,58,237,0.65)", marginBottom: 12,
          }}>
            Çok Yakında
          </p>
          <h1 style={{ fontSize: 26, fontWeight: 800, color: "#111827", marginBottom: 12 }}>
            Ödeme sistemi yakında aktif olacak
          </h1>
          <p style={{ fontSize: 14, color: "#6b7280", lineHeight: 1.65, marginBottom: 32 }}>
            Davetiyeniz hazır ve taslak olarak kaydedildi. Ödeme özelliği çok yakında devreye girecek, o güne kadar davetiyenizi düzenleyebilirsiniz.
          </p>
          <Link href={`/dashboard/davetiye/${slug}`} style={{
            display: "inline-flex", alignItems: "center", gap: 8,
            background: "linear-gradient(135deg,#7C3AED,#DB2777)",
            color: "#fff", textDecoration: "none",
            padding: "12px 28px", borderRadius: 16,
            fontSize: 14, fontWeight: 700,
            boxShadow: "0 8px 24px rgba(124,58,237,0.3)",
          }}>
            ← Davetiyeye Dön
          </Link>
        </div>
      </div>
    );
  }

  const sablon = SABLONLAR.find(s => s.id === davetiye.sablon) ?? SABLONLAR[0];
  const renk = sablon.renk;
  const emoji = EMOJILER[davetiye.etkinlikTur] ?? "🎉";
  const etiket = ETIKETLER[davetiye.etkinlikTur] ?? "Etkinlik";

  const fiyatSnapshot = davetiye.fiyatSnapshot as DavetiyeFiyatSonucu | null;
  const fiyat = fiyatSnapshot ?? davetiyeFiyatiHesapla({
    sablon: davetiye.sablon,
    muzik: davetiye.muzik,
    albumAktif: davetiye.albumAktif,
    aniDefteriAktif: davetiye.aniDefteriAktif,
    sesliAniAktif: davetiye.sesliAniAktif,
    canliDuvarAktif: davetiye.canliDuvarAktif,
    oturmaPlanAktif: davetiye.oturmaPlanAktif,
  });

  const TUM_UPSELL: UpsellOzellik[] = [
    { kod: "album-foto",   icon: "📸", ad: "Fotoğraf Albümü",       desc: "Misafirler fotoğraf yükler, sen onaylarsın",        tutar: DAVETIYE_FIYAT_KALEMLERI.album.tutar },
    { kod: "ani-defteri",  icon: "💌", ad: "Anı Defteri",           desc: "Misafirler yazılı iyi dilek bırakır",              tutar: DAVETIYE_FIYAT_KALEMLERI.aniDefteri.tutar },
    { kod: "canli-duvar",  icon: "📺", ad: "Canlı Fotoğraf Duvarı", desc: "Fotoğraflar salonunuzdaki ekranda akar",           tutar: DAVETIYE_FIYAT_KALEMLERI.canliDuvar.tutar },
    { kod: "sesli-ani",    icon: "🎙️", ad: "Sesli Anı Defteri",    desc: "Misafirler sesli mesaj bırakır",                   tutar: DAVETIYE_FIYAT_KALEMLERI.sesliAni.tutar },
    { kod: "oturma-plani", icon: "🪑", ad: "Oturma Planı",          desc: "Masa ve koltuk düzeni, davetli atama",             tutar: DAVETIYE_FIYAT_KALEMLERI.oturmaPlan.tutar },
  ];

  const seciliKodlar = new Set(fiyat.kalemler.map(k => k.kod));
  const upsellOzellikler = TUM_UPSELL.filter(o => !seciliKodlar.has(o.kod));

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
        @media (max-width: 640px) {
          .co-ref-strip { padding: 16px 18px !important; gap: 12px !important; }
          .co-ref-strip .co-ref-icon { width: 36px !important; height: 36px !important; font-size: 18px !important; }
        }
      `}</style>

      <div style={{
        minHeight: "100vh",
        background: "linear-gradient(148deg, #faf7ff 0%, #fdf4ff 55%, #f7f3ff 100%)",
        position: "relative", overflow: "hidden",
      }}>
        {/* Glowing orbs */}
        <div style={{
          position: "absolute", top: "-5%", left: "-8%",
          width: 700, height: 700, borderRadius: "50%",
          background: `radial-gradient(circle, ${renk}18 0%, transparent 62%)`,
          filter: "blur(90px)",
          animation: "co-orb 16s ease-in-out infinite",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-8%", right: "-5%",
          width: 550, height: 550, borderRadius: "50%",
          background: "radial-gradient(circle, rgba(219,39,119,0.09) 0%, transparent 62%)",
          filter: "blur(80px)",
          animation: "co-orb 20s ease-in-out infinite reverse",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", inset: 0, opacity: 0.025, pointerEvents: "none",
          backgroundImage: "radial-gradient(circle, rgba(0,0,0,0.6) 1px, transparent 1px)",
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
              <span style={{ fontFamily: "var(--font-dancing),cursive", fontSize: 24, color: "#1f2937" }}>Bekleriz</span>
            </Link>
            <Link href={`/dashboard/davetiye/${slug}`} style={{
              fontSize: 13, color: "#9ca3af",
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
              background: "#ffffff",
              border: "1px solid #ede9f6",
              borderRadius: 28,
              padding: "36px 32px",
              boxShadow: "0 4px 32px rgba(124,58,237,0.07), 0 1px 4px rgba(0,0,0,0.04)",
              animation: "co-up 0.55s 0.08s both",
            }}>

              {/* Template badge */}
              <div style={{
                display: "inline-flex", alignItems: "center", gap: 8,
                padding: "6px 14px", borderRadius: 999, marginBottom: 26,
                background: `${renk}15`, border: `1px solid ${renk}35`,
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
                fontSize: 44, color: "#1f2937", lineHeight: 1.12, marginBottom: 8,
              }}>
                {davetiye.baslik}
              </h1>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 30, lineHeight: 1.6 }}>
                Davetiyeniz hazır — ödeme sonrası anında yayına alınacak.
              </p>

              {/* Date & venue */}
              {(tarihStr || davetiye.mekan) && (
                <div style={{
                  padding: "18px 20px", borderRadius: 18, marginBottom: 26,
                  background: "#f9fafb",
                  border: "1px solid #f3f4f6",
                  display: "flex", flexDirection: "column", gap: 14,
                }}>
                  {tarihStr && (
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0, fontSize: 16,
                        background: `${renk}12`, border: `1px solid ${renk}22`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>📅</span>
                      <div>
                        <p style={{ fontSize: 10, color: "#9ca3af", marginBottom: 3 }}>Tarih</p>
                        <p style={{ fontSize: 14, color: "#1f2937", fontWeight: 600 }}>{tarihStr}</p>
                      </div>
                    </div>
                  )}
                  {davetiye.mekan && (
                    <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
                      <span style={{
                        width: 36, height: 36, borderRadius: 10, flexShrink: 0, fontSize: 16,
                        background: `${renk}12`, border: `1px solid ${renk}22`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>📍</span>
                      <div>
                        <p style={{ fontSize: 10, color: "#9ca3af", marginBottom: 3 }}>Mekan</p>
                        <p style={{ fontSize: 14, color: "#1f2937", fontWeight: 600 }}>{davetiye.mekan}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Price breakdown */}
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "#9ca3af", marginBottom: 12,
              }}>
                Sipariş Özeti
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                {fiyat.kalemler.map(kalem => (
                  <div key={kalem.kod} style={{
                    display: "flex", alignItems: "center", justifyContent: "space-between",
                    padding: "11px 16px", borderRadius: 13,
                    background: "#f9fafb",
                    border: "1px solid #f3f4f6",
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 14 }}>{KALEM_IKONU[kalem.kod] ?? "✦"}</span>
                      <span style={{ fontSize: 13, color: "#374151" }}>{kalem.ad}</span>
                    </div>
                    <span style={{ fontSize: 13, fontWeight: 700, color: "#111827" }}>{tutarMetni(kalem.tutar)}</span>
                  </div>
                ))}
              </div>

              {/* Upsell */}
              <OdemeUpsell davetiyeId={davetiye.id} ozellikler={upsellOzellikler} />

              {/* Kalite Checklist */}
              <div style={{
                marginTop: 16, padding: "16px 18px", borderRadius: 16,
                background: "rgba(16,185,129,0.06)",
                border: "1px solid rgba(16,185,129,0.2)",
              }}>
                <p style={{
                  fontSize: 9.5, fontWeight: 700, letterSpacing: "0.2em", textTransform: "uppercase",
                  color: "#10b981", marginBottom: 12,
                }}>Her Davetiyeyle Birlikte Geliyor</p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px 12px" }}>
                  {[
                    "📱 Mobil uyumlu",
                    "💬 WhatsApp paylaşım hazır",
                    "📲 QR kod hazır",
                    "✅ RSVP paneli hazır",
                  ].map(item => (
                    <div key={item} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                      <div style={{
                        width: 16, height: 16, borderRadius: 999, flexShrink: 0,
                        background: "rgba(16,185,129,0.12)", border: "1px solid rgba(16,185,129,0.3)",
                        display: "flex", alignItems: "center", justifyContent: "center",
                      }}>
                        <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="rgba(5,150,105,0.9)" strokeWidth={3.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span style={{ fontSize: 11.5, color: "#374151", lineHeight: 1.3 }}>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div style={{
                display: "flex", alignItems: "center", justifyContent: "space-between",
                padding: "18px 20px", marginTop: 12, borderRadius: 18,
                background: `linear-gradient(135deg, ${renk}12 0%, rgba(109,40,217,0.08) 100%)`,
                border: `1px solid ${renk}28`,
              }}>
                <span style={{ fontSize: 14, fontWeight: 600, color: "#6b7280" }}>Toplam</span>
                <span style={{ fontSize: 28, fontWeight: 800, color: "#1f2937", letterSpacing: "-0.5px" }}>
                  {tutarMetni(fiyat.toplamTutar)}
                </span>
              </div>
            </div>

            {/* ── RIGHT: Billing form ── */}
            <div style={{
              background: "#ffffff",
              border: "1px solid #ede9f6",
              borderRadius: 28,
              padding: "36px 32px",
              boxShadow: "0 4px 32px rgba(124,58,237,0.07), 0 1px 4px rgba(0,0,0,0.04)",
              animation: "co-up 0.55s 0.22s both",
            }}>
              <p style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", color: "#7c3aed", marginBottom: 8,
              }}>
                Güvenli Ödeme
              </p>
              <h2 style={{ fontSize: 22, fontWeight: 800, color: "#1f2937", marginBottom: 6 }}>Fatura Bilgileri</h2>
              <p style={{ fontSize: 13, color: "#9ca3af", marginBottom: 26, lineHeight: 1.6 }}>
                Ad, telefon ve şehir bilgisi ödeme güvenliği için alınır; kurumsal fatura isterseniz vergi ve adres bilgisi ayrıca istenir.
              </p>

              <OdemeCheckoutForm davetiyeId={davetiye.id} />

              {/* Trust signals */}
              <div style={{ marginTop: 22, display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                {[
                  { icon: "🔒", text: "Kart bilgilerin saklanmaz" },
                  { icon: "⚡", text: "Ödeme sonrası anında yayın" },
                  { icon: "💳", text: "Tek seferlik, abonelik yok" },
                  { icon: "🔄", text: "Dilediğin zaman düzenle" },
                ].map(item => (
                  <div key={item.text} style={{
                    display: "flex", alignItems: "center", gap: 8,
                    padding: "9px 12px", borderRadius: 12,
                    background: "#f9fafb",
                    border: "1px solid #f3f4f6",
                  }}>
                    <span style={{ fontSize: 13, flexShrink: 0 }}>{item.icon}</span>
                    <span style={{ fontSize: 11, color: "#6b7280", lineHeight: 1.35 }}>{item.text}</span>
                  </div>
                ))}
              </div>

              {/* Cayma hakkı notu */}
              <p style={{
                marginTop: 14, fontSize: 10.5, color: "#d1d5db",
                lineHeight: 1.65, textAlign: "center",
              }}>
                Bekleriz dijital bir hizmettir. Ödeme onaylanıp davetiye yayına alındıktan sonra
                dijital içerik teslimi başlar; bu aşamada mesafeli satış mevzuatı kapsamındaki
                cayma hakkı sona erer. Satın almadan önce{" "}
                <Link href="/sablonlar" style={{ color: "#a78bfa", textDecoration: "none" }}>
                  ücretsiz önizleme
                </Link>{" "}
                yapmanızı öneririz.
              </p>

              <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 12, flexWrap: "wrap" }}>
                {["🔒 SSL", "✅ iyzico", "💳 3D Secure"].map(r => (
                  <span key={r} style={{ fontSize: 10, color: "#c4b5fd" }}>{r}</span>
                ))}
              </div>
            </div>
          </div>

          {/* ── Referral teaser strip ── */}
          <div className="co-ref-strip" style={{
            maxWidth: 1040, margin: "20px auto 0",
            background: "linear-gradient(135deg, rgba(124,58,237,0.08) 0%, rgba(219,39,119,0.06) 100%)",
            border: "1px solid rgba(168,85,247,0.22)",
            borderRadius: 20, padding: "18px 26px",
            display: "flex", alignItems: "center", gap: 18,
            animation: "co-up 0.55s 0.35s both",
          }}>
            <div className="co-ref-icon" style={{
              width: 44, height: 44, borderRadius: 14, flexShrink: 0,
              background: "linear-gradient(135deg,rgba(124,58,237,0.2),rgba(219,39,119,0.2))",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
            }}>🎁</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", marginBottom: 3 }}>
                Arkadaşını getir, her ikine{" "}
                <span style={{
                  background: "linear-gradient(135deg,#7c3aed,#db2777)",
                  WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
                }}>
                  50₺ kredi
                </span>{" "}
                kazan
              </p>
              <p style={{ fontSize: 12, color: "#9ca3af", lineHeight: 1.5 }}>
                Ödeme sonrası referral linkin panelinde belirecek — arkadaşın ödeme yaparsa ikisine de 50₺ yüklenir.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
