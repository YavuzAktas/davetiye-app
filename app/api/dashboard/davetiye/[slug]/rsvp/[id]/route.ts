import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ slug: string; id: string }> };

async function yetkiKontrol(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;
  return prisma.davetiye.findFirst({
    where: { slug, user: { email: session.user.email } },
    select: { id: true },
  });
}

export async function PATCH(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { slug, id } = await params;
  const davetiye = await yetkiKontrol(slug);
  if (!davetiye) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const body = await req.json();
  const data: { katilim?: boolean; kisiSayisi?: number } = {};

  if (typeof body.katilim === "boolean") data.katilim = body.katilim;
  if (typeof body.kisiSayisi === "number" && Number.isInteger(body.kisiSayisi) && body.kisiSayisi >= 1 && body.kisiSayisi <= 20) {
    data.kisiSayisi = body.kisiSayisi;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ hata: "Geçersiz veri." }, { status: 400 });
  }

  const sonuc = await prisma.rSVP.updateMany({
    where: { id, davetiyeId: davetiye.id },
    data,
  });

  if (sonuc.count === 0) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });
  return NextResponse.json({ tamam: true });
}
