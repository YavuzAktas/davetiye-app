import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { ipIzinVer, ipAlNextRequest } from "@/lib/rate-limit";
import { yasalOnayKaydiOlustur } from "@/lib/yasal-onay-kaydi";

const KAYIT_TAMAMLANAMADI =
  "Kayıt tamamlanamadı. Bilgileri kontrol edip tekrar deneyin veya giriş yapmayı deneyin.";

// 5 kayıt denemesi / IP / saat
export async function POST(req: NextRequest) {
  const ip = ipAlNextRequest(req);
  if (!ipIzinVer("kayit", ip, 5, 60 * 60_000)) {
    return NextResponse.json(
      { hata: "Çok fazla kayıt denemesi. Lütfen bir saat bekleyin." },
      { status: 429 },
    );
  }

  try {
    const { ad, email, sifre, kullanim } = await req.json();

    if (!ad?.trim() || !email?.trim() || !sifre)
      return NextResponse.json({ hata: "Tüm alanlar zorunludur." }, { status: 400 });

    if (!kullanim)
      return NextResponse.json({ hata: "Yasal bilgilendirme ve kullanım şartları onayı zorunludur." }, { status: 400 });

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim()))
      return NextResponse.json({ hata: "Geçerli bir e-posta adresi girin." }, { status: 400 });

    if (sifre.length < 8)
      return NextResponse.json({ hata: "Şifre en az 8 karakter olmalıdır." }, { status: 400 });

    const temizEmail = email.toLowerCase().trim();
    const mevcut = await prisma.user.findUnique({ where: { email: temizEmail } });
    if (mevcut)
      return NextResponse.json({ hata: KAYIT_TAMAMLANAMADI }, { status: 400 });

    const hash = await bcrypt.hash(sifre, 12);

    const user = await prisma.user.create({
      data: {
        name:          ad.trim(),
        email:         temizEmail,
        password:      hash,
        // Kullanıcı kayıt ekranında KVKK aydınlatmasını okuduğunu ve kullanım
        // şartlarını kabul ettiğini işaretler. Bu alan açık rıza değil,
        // aydınlatma/kabul kaydı olarak kullanılır.
        kvkkOnay:      true,
        kvkkOnayTarih: new Date(),
      },
    });

    await yasalOnayKaydiOlustur({
      userId: user.id,
      email: user.email,
      onayTipi: "kayit-yasal-bilgilendirme-ve-kullanim-sartlari",
      kaynak: "email-kayit",
    });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ hata: KAYIT_TAMAMLANAMADI }, { status: 500 });
  }
}
