import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

interface Props { params: Promise<{ slug: string }> }

const kapasiteSemasi = z.object({
  kapasiteLimiti: z.coerce.number().int().min(1).max(5000).nullable(),
}).strict();

export async function PATCH(req: NextRequest, { params }: Props) {
  const { slug } = await params;
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  const sonuc = kapasiteSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success) {
    return NextResponse.json({ hata: "Geçersiz kapasite değeri." }, { status: 400 });
  }
  const { kapasiteLimiti } = sonuc.data;

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, userId: session.user.id },
    select: { id: true },
  });
  if (!davetiye) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  await prisma.davetiye.update({
    where: { id: davetiye.id },
    data: { kapasiteLimiti },
  });

  return NextResponse.json({ basarili: true, kapasiteLimiti });
}
