import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { planOzellikVar } from "@/lib/planlar";
import { blobSilVeyaKuyrugaAl } from "@/lib/medya-silme";
import { imhaKaydiOlustur } from "@/lib/imha-kaydi";
import { davetiyeSesliAniCacheTag } from "@/lib/cache-tags";

type Params = { params: Promise<{ slug: string; id: string }> };

async function yetkiKontrol(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  if (!planOzellikVar(session.user.plan ?? "free", "sesliAni")) return null;

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, user: { email: session.user.email } },
    select: { id: true },
  });
  return davetiye;
}

export async function PATCH(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  if (!planOzellikVar(session.user.plan ?? "free", "sesliAni"))
    return NextResponse.json({ hata: "Bu özellik Premium plana özel.", upsell: true }, { status: 403 });

  const { slug, id } = await params;
  const davetiye = await yetkiKontrol(slug);
  if (!davetiye) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const { onaylandi } = await req.json();
  const sonuc = await prisma.sesliAni.updateMany({
    where: { id, davetiyeId: davetiye.id },
    data: { onaylandi: Boolean(onaylandi) },
  });

  if (sonuc.count === 0) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });
  revalidateTag(davetiyeSesliAniCacheTag(slug));
  return NextResponse.json({ tamam: true });
}

export async function DELETE(_req: NextRequest, { params }: Params): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  if (!planOzellikVar(session.user.plan ?? "free", "sesliAni"))
    return NextResponse.json({ hata: "Bu özellik Premium plana özel.", upsell: true }, { status: 403 });

  const { slug, id } = await params;
  const davetiye = await yetkiKontrol(slug);
  if (!davetiye) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const ani = await prisma.sesliAni.findFirst({ where: { id, davetiyeId: davetiye.id } });
  if (!ani) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  await blobSilVeyaKuyrugaAl(ani.dosyaUrl, "sesli-ani-silme");

  await prisma.sesliAni.delete({ where: { id } });
  revalidateTag(davetiyeSesliAniCacheTag(slug));
  await imhaKaydiOlustur({
    kaynak: "tekil-sesli-ani-silme",
    islemTuru: "kullanici-paneli-silme",
    veriKategorisi: "Sesli anı kaydı",
    adet: 1,
    yontem: "Vercel Blob silme/kuyruğa alma ve veritabanı kayıt silme",
    gerekce: "Davetiye sahibinin panel üzerinden silme talebi",
  });

  return NextResponse.json({ tamam: true });
}
