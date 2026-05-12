import { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

type ImhaKaydiInput = {
  kaynak: string;
  islemTuru: string;
  veriKategorisi: string;
  adet: number;
  yontem: string;
  gerekce: string;
  detay?: Prisma.InputJsonValue;
};

export async function imhaKaydiOlustur(kayit: ImhaKaydiInput) {
  if (kayit.adet <= 0) return;

  await prisma.imhaKaydi.create({
    data: kayit,
  });
}

export async function imhaKayitlariOlustur(kayitlar: ImhaKaydiInput[]) {
  const yazilacakKayitlar = kayitlar.filter((kayit) => kayit.adet > 0);
  if (yazilacakKayitlar.length === 0) return;

  await Promise.all(yazilacakKayitlar.map((kayit) => imhaKaydiOlustur(kayit)));
}
