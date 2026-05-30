import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ipIzinVer, ipAlNextRequest } from "@/lib/rate-limit";
import QRCode from "qrcode";

function davetiyeUrlMi(rawUrl: string, req: NextRequest): boolean {
  try {
    const appUrl = process.env.NEXT_PUBLIC_URL || req.nextUrl.origin;
    const hedef = new URL(rawUrl);
    const izinliOriginler = new Set([new URL(appUrl).origin, req.nextUrl.origin]);

    return izinliOriginler.has(hedef.origin)
      && (hedef.pathname.startsWith("/davetiye/") || hedef.pathname.startsWith("/d/"));
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }
  const ip = ipAlNextRequest(req);
  if (!(await ipIzinVer("qr", ip, 30, 60_000))) {
    return NextResponse.json({ hata: "Çok fazla istek." }, { status: 429 });
  }

  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  if (!url) {
    return NextResponse.json({ hata: "URL gerekli." }, { status: 400 });
  }
  if (!davetiyeUrlMi(url, req)) {
    return NextResponse.json({ hata: "QR kod yalnızca davetiye veya davetli bağlantıları için oluşturulabilir." }, { status: 400 });
  }

  const qrDataUrl = await QRCode.toDataURL(url, {
    width: 400,
    margin: 2,
    color: { dark: "#111827", light: "#ffffff" },
  });

  const base64 = qrDataUrl.split(",")[1];
  const buffer = Buffer.from(base64, "base64");

  return new NextResponse(buffer, {
    headers: {
      "Content-Type": "image/png",
      "Content-Disposition": "inline",
      "Cache-Control": "public, max-age=31536000",
    },
  });
}
