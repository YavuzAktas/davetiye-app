import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props { params: Promise<{ slug: string }> }

export async function PATCH(req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  const { kapasiteLimiti } = await req.json();

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: session.user.id },
    select: { id: true },
  });
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  const limit = kapasiteLimiti ? Number(kapasiteLimiti) : null;
  if (limit !== null && (isNaN(limit) || limit < 1)) {
    return NextResponse.json({ hata: "Geçersiz kapasite değeri." }, { status: 400 });
  }

  await prisma.davetiye.update({
    where: { id: davetiye.id },
    data: { kapasiteLimiti: limit },
  });

  return NextResponse.json({ basarili: true, kapasiteLimiti: limit });
}
