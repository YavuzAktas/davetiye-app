import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ipIzinVer } from "@/lib/rate-limit";

const markaSemasi = z.object({
  markaRenk: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/).optional().nullable(),
  markaSlogani: z.string().trim().max(120).optional().nullable(),
  destekTelefonu: z.string().trim().max(30).optional().nullable(),
  instagramUrl: z.string().trim().max(160).optional().nullable(),
  whatsappImzasi: z.string().trim().max(160).optional().nullable(),
}).strict();

function bosIseNull(deger?: string | null) {
  const temiz = deger?.trim();
  return temiz ? temiz : null;
}

function instagramNormalize(deger?: string | null) {
  const temiz = bosIseNull(deger);
  if (!temiz) return null;
  if (temiz.startsWith("@")) return `https://instagram.com/${temiz.slice(1)}`;
  if (/^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._]+\/?$/.test(temiz)) return temiz;
  if (/^[A-Za-z0-9._]{2,30}$/.test(temiz)) return `https://instagram.com/${temiz}`;
  return temiz;
}

export async function PATCH(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  if (!(await ipIzinVer("partner-marka", session.user.id, 20, 60 * 60_000))) {
    return NextResponse.json({ hata: "Saatlik marka ayarı güncelleme limitine ulaştınız." }, { status: 429 });
  }

  const sonuc = markaSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) {
    return NextResponse.json({ hata: "Marka bilgileri geçersiz." }, { status: 400 });
  }

  const partner = await prisma.partner.findUnique({
    where: { userId: session.user.id },
    select: { id: true, durum: true },
  });
  if (!partner || partner.durum !== "aktif") {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 403 });
  }

  const instagramUrl = instagramNormalize(sonuc.data.instagramUrl);
  if (instagramUrl && !/^https:\/\/(www\.)?instagram\.com\/[A-Za-z0-9._]+\/?$/.test(instagramUrl)) {
    return NextResponse.json({ hata: "Instagram alanına kullanıcı adı veya instagram.com bağlantısı girin." }, { status: 400 });
  }

  const guncel = await prisma.partner.update({
    where: { id: partner.id },
    data: {
      markaRenk: bosIseNull(sonuc.data.markaRenk) ?? "#7c3aed",
      markaSlogani: bosIseNull(sonuc.data.markaSlogani),
      destekTelefonu: bosIseNull(sonuc.data.destekTelefonu),
      instagramUrl,
      whatsappImzasi: bosIseNull(sonuc.data.whatsappImzasi),
    },
    select: {
      markaRenk: true,
      markaSlogani: true,
      destekTelefonu: true,
      instagramUrl: true,
      whatsappImzasi: true,
    },
  });

  return NextResponse.json({ marka: guncel });
}
