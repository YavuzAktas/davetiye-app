import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const secret = req.headers.get("authorization")?.replace("Bearer ", "");
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });
  }

  const sonuc = await prisma.partnerAbonelik.updateMany({
    where: {
      aktif: true,
      bitisAt: { lt: new Date() },
    },
    data: { aktif: false },
  });

  return NextResponse.json({ surecilan: sonuc.count });
}
