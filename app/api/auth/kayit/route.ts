import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { ad, email, sifre, kvkkOnay, kullanim } = await req.json();

    if (!ad?.trim() || !email?.trim() || !sifre)
      return NextResponse.json({ hata: "Tüm alanlar zorunludur." }, { status: 400 });

    if (!kvkkOnay)
      return NextResponse.json({ hata: "KVKK aydınlatma metnini onaylamanız zorunludur." }, { status: 400 });

    if (!kullanim)
      return NextResponse.json({ hata: "Kullanım şartlarını kabul etmeniz zorunludur." }, { status: 400 });

    if (sifre.length < 8)
      return NextResponse.json({ hata: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });

    const mevcut = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });
    if (mevcut)
      return NextResponse.json({ hata: "Bu e-posta adresi zaten kayıtlı." }, { status: 400 });

    const hash = await bcrypt.hash(sifre, 12);

    await prisma.user.create({
      data: {
        name:          ad.trim(),
        email:         email.toLowerCase().trim(),
        password:      hash,
        kvkkOnay:      true,
        kvkkOnayTarih: new Date(),
      },
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ hata: "Kayıt sırasında bir hata oluştu." }, { status: 500 });
  }
}
