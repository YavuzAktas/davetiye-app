import { createHmac } from "crypto";
import { prisma } from "@/lib/prisma";

const YASAL_METIN_SURUMU = "2026-05-12";

function emailHashOlustur(email?: string | null) {
  if (!email) return null;

  const secret = process.env.NEXTAUTH_SECRET ?? process.env.YASAL_ONAY_HASH_SECRET ?? "bekleriz-yasal-onay";
  return createHmac("sha256", secret).update(email.trim().toLowerCase()).digest("hex");
}

export async function yasalOnayKaydiOlustur({
  userId,
  email,
  onayTipi,
  kaynak,
}: {
  userId?: string | null;
  email?: string | null;
  onayTipi: string;
  kaynak: string;
}) {
  await prisma.yasalOnayKaydi.create({
    data: {
      userId,
      emailHash: emailHashOlustur(email),
      onayTipi,
      metinSurumu: YASAL_METIN_SURUMU,
      kaynak,
    },
  });
}

export async function yasalOnayKayitlariniHesapSilindiIsaretle(userId: string) {
  await prisma.yasalOnayKaydi.updateMany({
    where: {
      userId,
      hesapSilindiAt: null,
    },
    data: {
      hesapSilindiAt: new Date(),
    },
  });
}
