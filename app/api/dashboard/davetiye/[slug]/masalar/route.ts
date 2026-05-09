import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { planOzellikVar } from "@/lib/planlar";

async function davetiyeYetki(slug: string, email: string) {
  const user = await prisma.user.findUnique({ where: { email }, select: { id: true } });
  if (!user) return null;
  const d = await prisma.davetiye.findUnique({ where: { slug }, select: { id: true, userId: true } });
  if (!d || d.userId !== user.id) return null;
  return { userId: user.id, davetiyeId: d.id };
}

interface Params { params: Promise<{ slug: string }> }

export async function GET(_: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });
  if (!planOzellikVar(session.user.plan ?? "free", "oturmaPlan")) {
    return NextResponse.json({ hata: "Bu özellik Premium plana özel.", upsell: true }, { status: 403 });
  }

  const { slug } = await params;
  const yetki = await davetiyeYetki(slug, session.user.email);
  if (!yetki) return NextResponse.json({ hata: "Bulunamadı" }, { status: 404 });

  const masalar = await prisma.masa.findMany({
    where: { davetiyeId: yetki.davetiyeId },
    orderBy: { sira: "asc" },
    include: {
      atamalar: {
        include: {
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
  if (!planOzellikVar(session.user.plan ?? "free", "oturmaPlan")) {
    return NextResponse.json({ hata: "Bu özellik Premium plana özel.", upsell: true }, { status: 403 });
  }

  const { slug } = await params;
  const yetki = await davetiyeYetki(slug, session.user.email);
  if (!yetki) return NextResponse.json({ hata: "Bulunamadı" }, { status: 404 });

  const { isim, kapasite = 8 } = await req.json();
  if (!isim?.trim()) return NextResponse.json({ hata: "Masa ismi gerekli" }, { status: 400 });

  const siraSon = await prisma.masa.count({ where: { davetiyeId: yetki.davetiyeId } });
  const masa = await prisma.masa.create({
    data: { davetiyeId: yetki.davetiyeId, isim: isim.trim(), kapasite: Number(kapasite), sira: siraSon },
  });

  return NextResponse.json(masa, { status: 201 });
}
