import { NextRequest, NextResponse } from "next/server";
import { ImageResponse } from "next/og";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ipIzinVer, ipAlNextRequest } from "@/lib/rate-limit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

export const runtime = "nodejs";

const W = 1080;
const H = 1920;

const STILLER = {
  romantik: {
    bg: "linear-gradient(160deg, #fff1f2 0%, #fce7f3 50%, #ede9fe 100%)",
    accent: "#e11d48",
    accentLight: "#fecdd3",
    text: "#881337",
    sub: "#9f1239",
    muted: "#be185d",
    decorRenk: "#f43f5e",
    cardBg: "rgba(255,255,255,0.65)",
    etiket: "💒 DÜĞÜN DAVETİYESİ",
  },
  luks: {
    bg: "linear-gradient(160deg, #0f0f1a 0%, #1a1a2e 50%, #16213e 100%)",
    accent: "#d4af37",
    accentLight: "#d4af3722",
    text: "#f5f0e8",
    sub: "#c4a962",
    muted: "#9ca3af",
    decorRenk: "#d4af37",
    cardBg: "rgba(255,255,255,0.06)",
    etiket: "✦ DAVETİYE",
  },
  eglenceli: {
    bg: "linear-gradient(160deg, #ede9fe 0%, #fae8ff 50%, #fce7f3 100%)",
    accent: "#7c3aed",
    accentLight: "#ddd6fe",
    text: "#4c1d95",
    sub: "#6d28d9",
    muted: "#7c3aed",
    decorRenk: "#a855f7",
    cardBg: "rgba(255,255,255,0.70)",
    etiket: "🎉 ETKİNLİK",
  },
  minimal: {
    bg: "linear-gradient(160deg, #ffffff 0%, #f9fafb 100%)",
    accent: "#111827",
    accentLight: "#f3f4f6",
    text: "#111827",
    sub: "#374151",
    muted: "#6b7280",
    decorRenk: "#111827",
    cardBg: "rgba(243,244,246,0.70)",
    etiket: "DAVETİYE",
  },
  geleneksel: {
    bg: "linear-gradient(160deg, #fef3c7 0%, #fde68a 40%, #fef9c3 100%)",
    accent: "#92400e",
    accentLight: "#fef3c7",
    text: "#78350f",
    sub: "#92400e",
    muted: "#b45309",
    decorRenk: "#d97706",
    cardBg: "rgba(255,255,255,0.60)",
    etiket: "🕌 DAVETİYE",
  },
} as const;

type Stil = keyof typeof STILLER;

function fontYukle(dosyaAdi: string): Buffer {
  return fs.readFileSync(path.join(process.cwd(), "public", "fonts", dosyaAdi));
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const ip = ipAlNextRequest(req);
  if (!(await ipIzinVer("story", ip, 20, 60_000))) {
    return NextResponse.json({ hata: "Çok fazla istek." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  const stilParam = (searchParams.get("stil") ?? "romantik") as Stil;
  const stil = STILLER[stilParam] ? stilParam : "romantik";

  if (!slug) return NextResponse.json({ hata: "slug gerekli." }, { status: 400 });

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: session.user.id },
    select: {
      baslik: true, etkinlikTur: true, tarih: true,
      mekan: true, kisi1: true, kisi2: true, slug: true,
    },
  });

  if (!davetiye) return NextResponse.json({ hata: "Davetiye bulunamadı." }, { status: 404 });

  const s = STILLER[stil];
  const davetiyeUrl = `${process.env.NEXT_PUBLIC_URL}/davetiye/${slug}`;

  const tarihStr = davetiye.tarih
    ? new Intl.DateTimeFormat("tr-TR", {
        day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
      }).format(new Date(davetiye.tarih))
    : null;

  // İsimler: kisi1 & kisi2 varsa onlar, yoksa baslik'ı kullan
  const isimler = davetiye.kisi1 && davetiye.kisi2
    ? `${davetiye.kisi1} & ${davetiye.kisi2}`
    : davetiye.baslik;

  // QR kod base64
  const qrDataUrl = await QRCode.toDataURL(davetiyeUrl, {
    width: 280,
    margin: 2,
    color: {
      dark: stil === "luks" ? "#d4af37" : "#111827",
      light: stil === "luks" ? "#0f0f1a" : "#ffffff",
    },
  });

  const fontRegular = fontYukle("NotoSans-Regular.ttf");
  const fontBold    = fontYukle("NotoSans-Bold.ttf");

  const ETKINLIK_ETIKET: Record<string, string> = {
    dugun: "💒 DÜĞÜN DAVETİYESİ",
    nisan: "💍 NİŞAN DAVETİYESİ",
    dogumgunu: "🎂 DOĞUM GÜNÜ",
    sunnet: "⭐ SÜNNET DAVETİYESİ",
    kina: "🕯️ KINA GECESİ",
    kurumsal: "🏢 ETKİNLİK",
    diger: "🎉 ETKİNLİK",
  };
  const etiketMetni = ETKINLIK_ETIKET[davetiye.etkinlikTur] ?? s.etiket;

  return new ImageResponse(
    (
      <div
        style={{
          width: W,
          height: H,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundImage: s.bg,
          position: "relative",
          fontFamily: "NotoSans",
        }}
      >
        {/* Dekoratif üst çizgi */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 8,
            backgroundColor: s.accent,
          }}
        />

        {/* Dekoratif daire - sol üst */}
        <div
          style={{
            position: "absolute",
            top: -180,
            left: -180,
            width: 500,
            height: 500,
            borderRadius: "50%",
            backgroundColor: s.decorRenk,
            opacity: 0.08,
          }}
        />

        {/* Dekoratif daire - sağ alt */}
        <div
          style={{
            position: "absolute",
            bottom: -200,
            right: -200,
            width: 600,
            height: 600,
            borderRadius: "50%",
            backgroundColor: s.decorRenk,
            opacity: 0.06,
          }}
        />

        {/* İçerik kartı */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            backgroundColor: s.cardBg,
            borderRadius: 48,
            padding: "80px 72px",
            margin: "0 64px",
            width: W - 128,
            gap: 0,
          }}
        >
          {/* Etkinlik etiketi */}
          <div
            style={{
              fontSize: 28,
              fontWeight: 700,
              letterSpacing: 4,
              color: s.muted,
              marginBottom: 48,
              display: "flex",
            }}
          >
            {etiketMetni}
          </div>

          {/* İsimler / Başlık */}
          <div
            style={{
              fontSize: isimler.length > 20 ? 72 : 88,
              fontWeight: 700,
              color: s.text,
              lineHeight: 1.1,
              marginBottom: 40,
              display: "flex",
              textAlign: "center",
            }}
          >
            {isimler}
          </div>

          {/* Ayırıcı çizgi */}
          <div
            style={{
              width: 80,
              height: 3,
              backgroundColor: s.accent,
              borderRadius: 99,
              marginBottom: 48,
              display: "flex",
            }}
          />

          {/* Tarih */}
          {tarihStr && (
            <div
              style={{
                fontSize: 44,
                fontWeight: 700,
                color: s.sub,
                marginBottom: 20,
                display: "flex",
              }}
            >
              {tarihStr}
            </div>
          )}

          {/* Mekan */}
          {davetiye.mekan && (
            <div
              style={{
                fontSize: 36,
                color: s.muted,
                marginBottom: 64,
                display: "flex",
                maxWidth: 780,
                textAlign: "center",
              }}
            >
              {davetiye.mekan}
            </div>
          )}

          {/* QR Kodu */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 28,
            }}
          >
            <div
              style={{
                backgroundColor: stil === "luks" ? "#0f0f1a" : "#ffffff",
                borderRadius: 24,
                padding: 20,
                display: "flex",
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={qrDataUrl} width={240} height={240} alt="QR" />
            </div>

            <div
              style={{
                fontSize: 28,
                color: s.muted,
                textAlign: "center",
                display: "flex",
              }}
            >
              Katılımını bildirmek için QR kodu okut
            </div>

            {/* Kısa URL */}
            <div
              style={{
                fontSize: 26,
                color: s.accent,
                fontWeight: 700,
                backgroundColor: s.accentLight,
                paddingLeft: 28,
                paddingRight: 28,
                paddingTop: 14,
                paddingBottom: 14,
                borderRadius: 16,
                display: "flex",
              }}
            >
              {davetiyeUrl.replace(/^https?:\/\//, "")}
            </div>
          </div>
        </div>

        {/* Watermark */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            display: "flex",
            fontSize: 24,
            color: s.muted,
            opacity: 0.5,
            letterSpacing: 1,
          }}
        >
          bekleriz.com ile hazırlandı
        </div>
      </div>
    ),
    {
      width: W,
      height: H,
      fonts: [
        { name: "NotoSans", data: fontRegular, weight: 400 },
        { name: "NotoSans", data: fontBold, weight: 700 },
      ],
    }
  );
}
