import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/auth";
import { VARSAYILAN_RSVP_SORULAR } from "@/lib/rsvp-sorular";

interface Params { params: Promise<{ slug: string }> }

export async function GET(_req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });
  const { slug } = await params;

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, user: { email: session.user.email } },
    select: { id: true, rsvpSorular: true },
  });
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı" }, { status: 404 });

  return NextResponse.json({
    rsvpSorular: davetiye.rsvpSorular ?? VARSAYILAN_RSVP_SORULAR,
  });
}

export async function PATCH(req: NextRequest, { params }: Params) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ hata: "Yetkisiz" }, { status: 401 });
  const { slug } = await params;

  const body = await req.json().catch(() => null);
  if (!Array.isArray(body?.rsvpSorular)) {
    return NextResponse.json({ hata: "Geçersiz veri" }, { status: 400 });
  }

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, user: { email: session.user.email } },
    select: { id: true },
  });
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı" }, { status: 404 });

  await prisma.davetiye.update({
    where: { id: davetiye.id },
    data: { rsvpSorular: body.rsvpSorular },
  });

  return NextResponse.json({ basarili: true });
}
