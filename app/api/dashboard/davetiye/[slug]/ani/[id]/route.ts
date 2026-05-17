import { NextRequest, NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";
import { imhaKaydiOlustur } from "@/lib/imha-kaydi";
import { davetiyeAniCacheTag } from "@/lib/cache-tags";

type Params = { params: Promise<{ slug: string; id: string }> };

async function yetkiKontrol(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, user: { email: session.user.email } },
    select: { id: true, odemeDurumu: true, albumAktif: true, user: { select: { plan: true } } },
  });
  return davetiye && davetiyeOzelligiAktif(davetiye, "album") ? davetiye : null;
}

export async function PATCH(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const { slug, id } = await params;
  const davetiye = await yetkiKontrol(slug);
  if (!davetiye) return NextResponse.json({ hata: "Bu davetiyede anı özelliği aktif değil." }, { status: 403 });

  const { onaylandi } = await req.json();
  const ani = await prisma.aniDefteri.updateMany({
    where: { id, davetiyeId: davetiye.id },
    data: { onaylandi: Boolean(onaylandi) },
  });

  if (ani.count === 0) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });
  revalidateTag(davetiyeAniCacheTag(slug));
  return NextResponse.json({ tamam: true });
}

export async function DELETE(_req: NextRequest, { params }: Params): Promise<NextResponse> {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const { slug, id } = await params;
  const davetiye = await yetkiKontrol(slug);
  if (!davetiye) return NextResponse.json({ hata: "Bu davetiyede anı özelliği aktif değil." }, { status: 403 });

  const ani = await prisma.aniDefteri.findFirst({ where: { id, davetiyeId: davetiye.id } });
  if (!ani) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  await prisma.aniDefteri.delete({ where: { id } });
  revalidateTag(davetiyeAniCacheTag(slug));
  await imhaKaydiOlustur({
    kaynak: "tekil-yazili-ani-silme",
    islemTuru: "kullanici-paneli-silme",
    veriKategorisi: "Yazılı anı kaydı",
    adet: 1,
    yontem: "veritabanı kayıt silme",
    gerekce: "Davetiye sahibinin panel üzerinden silme talebi",
  });

  return NextResponse.json({ tamam: true });
}
