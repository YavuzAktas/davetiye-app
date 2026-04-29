import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, sifre } = await req.json();

    if (!token || !sifre) {
      return NextResponse.json({ hata: "Token ve şifre gerekli." }, { status: 400 });
    }

    if (sifre.length < 8) {
      return NextResponse.json({ hata: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });
    }

    const kayit = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!kayit || !kayit.identifier.startsWith("sifre:")) {
      return NextResponse.json({ hata: "Geçersiz veya kullanılmış bağlantı." }, { status: 400 });
    }

    if (kayit.expires < new Date()) {
      await prisma.verificationToken.delete({ where: { token } });
      return NextResponse.json({ hata: "Bu bağlantının süresi dolmuş. Yeni bir talep oluşturun." }, { status: 400 });
    }

    const email = kayit.identifier.replace("sifre:", "");
    const hash = await bcrypt.hash(sifre, 12);

    await prisma.user.update({
      where: { email },
      data: { password: hash },
    });

    // Kullanılan tokeni sil
    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ hata: "Bir hata oluştu." }, { status: 500 });
  }
}
