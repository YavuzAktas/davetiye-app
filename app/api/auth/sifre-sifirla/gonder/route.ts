import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sifreSifirlamaGonder } from "@/lib/email";
import { randomBytes } from "crypto";

export async function POST(req: Request) {
  try {
    const { email } = await req.json();

    if (!email?.trim()) {
      return NextResponse.json({ hata: "E-posta adresi gerekli." }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ hata: "Geçerli bir e-posta adresi girin." }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email: email.toLowerCase().trim() },
    });

    // Kullanıcı bulunamazsa veya şifre yoksa (Google OAuth kullanıcısı)
    // güvenlik için yine de başarılı döndür — e-posta numaralandırma saldırısı önlemi
    if (!user?.password) {
      return NextResponse.json({ ok: true });
    }

    // Eski tokenları temizle
    await prisma.verificationToken.deleteMany({
      where: { identifier: `sifre:${user.email}` },
    });

    const token = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 saat

    await prisma.verificationToken.create({
      data: {
        identifier: `sifre:${user.email}`,
        token,
        expires,
      },
    });

    const resetUrl = `${process.env.NEXT_PUBLIC_URL}/sifre-sifirla/yeni?token=${token}`;
    await sifreSifirlamaGonder(user.email!, resetUrl);

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ hata: "Bir hata oluştu." }, { status: 500 });
  }
}
