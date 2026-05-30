import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";

const masaGuncelleSemasi = z.object({
  isim: z.string().trim().min(1).max(80).optional(),
  kapasite: z.coerce.number().int().min(1).max(100).optional(),
}).strict().refine((data) => data.isim !== undefined || data.kapasite !== undefined);

async function masaYetki(slug: string, masaId: string, email: string) {
  return prisma.masa.findFirst({
    where: { id: masaId, davetiye: { slug, user: { email } } },
    select: { id: true, davetiye: { select: { odemeDurumu: true, oturmaPlanAktif: true } } },
  });
}

interface Params { params: Promise<{ slug: string; masaId: string }> }

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });

  const { slug, masaId } = await params;
  const masa = await masaYetki(slug, masaId, session.user.email);
  if (!masa || !davetiyeOzelligiAktif(masa.davetiye, "oturmaPlan")) return NextResponse.json({ hata: "Bu davetiyede oturma planı aktif değil." }, { status: 403 });

  const sonuc = masaGuncelleSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) return NextResponse.json({ hata: "Geçersiz masa bilgisi." }, { status: 400 });
  const { isim, kapasite } = sonuc.data;
  const updated = await prisma.masa.update({
    where: { id: masaId },
    data: {
      ...(isim !== undefined && { isim }),
      ...(kapasite !== undefined && { kapasite }),
    },
  });

  return NextResponse.json(updated);
}

export async function DELETE(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });

  const { slug, masaId } = await params;
  const masa = await masaYetki(slug, masaId, session.user.email);
  if (!masa || !davetiyeOzelligiAktif(masa.davetiye, "oturmaPlan")) return NextResponse.json({ hata: "Bu davetiyede oturma planı aktif değil." }, { status: 403 });

  await prisma.masa.delete({ where: { id: masaId } });
  return NextResponse.json({ basarili: true });
}
