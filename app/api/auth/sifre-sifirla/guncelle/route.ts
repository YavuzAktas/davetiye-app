import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ipAlNextRequest, ipIzinVer } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const ip = ipAlNextRequest(req);
  if (!(await ipIzinVer("sifre-sifirla-guncelle", ip, 10, 60 * 60_000))) {
    return NextResponse.json(
      { hata: "Çok fazla şifre sıfırlama denemesi. Lütfen bir saat bekleyin." },
      { status: 429 },
    );
  }

  try {
    const body = await req.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return NextResponse.json({ hata: "Geçersiz istek." }, { status: 400 });
    }

    const { token, sifre } = body as { token?: string; sifre?: string };

    if (!token?.trim() || !sifre) {
      return NextResponse.json({ hata: "Token ve şifre gerekli." }, { status: 400 });
    }
    const temizToken = token.trim();

    if (sifre.length < 8) {
      return NextResponse.json({ hata: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });
    }

    const kayit = await prisma.verificationToken.findUnique({
      where: { token: temizToken },
    });

    if (!kayit || !kayit.identifier.startsWith("sifre:")) {
      return NextResponse.json({ hata: "Geçersiz veya kullanılmış bağlantı." }, { status: 400 });
    }

    if (kayit.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token: temizToken } });
      return NextResponse.json({ hata: "Bu bağlantının süresi dolmuş. Yeni bir talep oluşturun." }, { status: 400 });
    }

    const email = kayit.identifier.replace("sifre:", "");
    const hash = await bcrypt.hash(sifre, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hash },
    });

    // Kullanılan tokeni sil
    await prisma.verificationToken.delete({ where: { token: temizToken } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ hata: "Bir hata oluştu." }, { status: 500 });
  }
}
