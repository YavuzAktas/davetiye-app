import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { del } from "@vercel/blob";

type Params = { params: Promise<{ slug: string; id: string }> };

async function yetkiKontrol(slug: string) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return null;

  const davetiye = await prisma.davetiye.findFirst({
    where: { slug, user: { email: session.user.email } },
    select: { id: true },
  });
  return davetiye;
}

/* PATCH: onayla */
export async function PATCH(req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { slug, id } = await params;
  const davetiye = await yetkiKontrol(slug);
  if (!davetiye) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const { onaylandi } = await req.json();

  const foto = await prisma.albumFoto.updateMany({
    where: { id, davetiyeId: davetiye.id },
    data: { onaylandi: Boolean(onaylandi) },
  });

  if (foto.count === 0) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });
  return NextResponse.json({ tamam: true });
}

/* DELETE: sil (blob'u + DB kaydını) */
export async function DELETE(_req: NextRequest, { params }: Params): Promise<NextResponse> {
  const { slug, id } = await params;
  const davetiye = await yetkiKontrol(slug);
  if (!davetiye) return NextResponse.json({ hata: "Yetkisiz." }, { status: 401 });

  const foto = await prisma.albumFoto.findFirst({
    where: { id, davetiyeId: davetiye.id },
  });
  if (!foto) return NextResponse.json({ hata: "Bulunamadı." }, { status: 404 });

  try { await del(foto.dosyaUrl); } catch { /* blob zaten silinmiş olabilir */ }

  await prisma.albumFoto.delete({ where: { id } });
  return NextResponse.json({ tamam: true });
}
