import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

/* GET — okunmamış sayısı + son 20 bildirim */
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const [okunmamis, bildirimler] = await Promise.all([
    prisma.bildirim.count({
      where: { userId: session.user.id, okundu: false },
    }),
    prisma.bildirim.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: { id: true, tip: true, baslik: true, mesaj: true, okundu: true, davetiyeSlug: true, createdAt: true },
    }),
  ]);

  return NextResponse.json({ okunmamis, bildirimler });
}

/* PATCH — hepsini okundu işaretle */
export async function PATCH() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  await prisma.bildirim.updateMany({
    where: { userId: session.user.id, okundu: false },
    data: { okundu: true },
  });

  return NextResponse.json({ tamam: true });
}
