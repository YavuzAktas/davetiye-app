import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { davetiyeOzelligiAktif } from "@/lib/davetiye-ozellikleri";

const masaSemasi = z.object({
  isim: z.string().trim().min(1).max(80),
  kapasite: z.coerce.number().int().min(1).max(100).default(8),
}).strict();

async function davetiyeYetki(slug: string, email: string) {
  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, user: { email } },
    select: { id: true, odemeDurumu: true, oturmaPlanAktif: true },
  });
  return davetiye && davetiyeOzelligiAktif(davetiye, "oturmaPlan") ? { davetiyeId: davetiye.id } : null;
}

interface Params { params: Promise<{ slug: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });

  const { slug } = await params;
  const yetki = await davetiyeYetki(slug, session.user.email);
  if (!yetki) return NextResponse.json({ hata: "Bu davetiyede oturma planı aktif değil." }, { status: 403 });

  const masalar = await prisma.masa.findMany({
    where: { davetiyeId: yetki.davetiyeId },
    orderBy: { sira: "asc" },
    select: {
      id: true,
      isim: true,
      kapasite: true,
      atamalar: {
        select: {
          id: true,
          rsvp: { select: { id: true, ad: true, kisiSayisi: true, diyet: true } },
        },
      },
    },
  });

  const atanmamis = await prisma.rSVP.findMany({
    where: {
      davetiyeId: yetki.davetiyeId,
      katilim: true,
      masaAtamasi: null,
    },
    select: { id: true, ad: true, kisiSayisi: true, diyet: true },
    orderBy: { createdAt: "asc" },
  });

  return NextResponse.json({ masalar, atanmamis });
}

export async function POST(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });

  const { slug } = await params;
  const yetki = await davetiyeYetki(slug, session.user.email);
  if (!yetki) return NextResponse.json({ hata: "Bu davetiyede oturma planı aktif değil." }, { status: 403 });

  const sonuc = masaSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) return NextResponse.json({ hata: "Geçersiz masa bilgisi." }, { status: 400 });
  const { isim, kapasite } = sonuc.data;

  const siraSon = await prisma.masa.count({ where: { davetiyeId: yetki.davetiyeId } });
  const masa = await prisma.masa.create({
    data: { davetiyeId: yetki.davetiyeId, isim, kapasite, sira: siraSon },
  });

  return NextResponse.json(masa, { status: 201 });
}
