import { del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

function hataMesaji(err: unknown) {
  return err instanceof Error ? err.message : String(err);
}

function sonrakiDenemeTarihi(denemeSayisi: number) {
  const dakika = Math.min(60, Math.max(5, denemeSayisi * 10));
  return new Date(Date.now() + dakika * 60_000);
}

export async function medyaSilmeKuyrugunaEkle(dosyaUrl: string, kaynak: string, err: unknown) {
  const sonHata = hataMesaji(err).slice(0, 500);

  await prisma.medyaSilmeKuyrugu.upsert({
    where: { dosyaUrl },
    create: {
      dosyaUrl,
      kaynak,
      denemeSayisi: 1,
      sonHata,
      sonrakiDeneme: sonrakiDenemeTarihi(1),
    },
    update: {
      kaynak,
      denemeSayisi: { increment: 1 },
      sonHata,
      sonrakiDeneme: sonrakiDenemeTarihi(2),
    },
  });
}

export async function blobSilVeyaKuyrugaAl(dosyaUrl: string, kaynak: string) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    await medyaSilmeKuyrugunaEkle(dosyaUrl, kaynak, new Error("BLOB_READ_WRITE_TOKEN eksik"));
    return false;
  }

  try {
    await del(dosyaUrl);
    await prisma.medyaSilmeKuyrugu.deleteMany({ where: { dosyaUrl } });
    return true;
  } catch (err) {
    await medyaSilmeKuyrugunaEkle(dosyaUrl, kaynak, err);
    return false;
  }
}

export async function bloblariSilVeyaKuyrugaAl(dosyaUrlListesi: string[], kaynak: string) {
  const tekilUrlListesi = [...new Set(dosyaUrlListesi.filter(Boolean))];
  let silinen = 0;
  let kuyrugaAlinan = 0;

  for (const dosyaUrl of tekilUrlListesi) {
    const basarili = await blobSilVeyaKuyrugaAl(dosyaUrl, kaynak);
    if (basarili) silinen++;
    else kuyrugaAlinan++;
  }

  return { silinen, kuyrugaAlinan };
}
