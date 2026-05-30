import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

interface Props { params: Promise<{ kod: string }> }

export async function GET(req: NextRequest, { params }: Props) {
  const { kod } = await params;

  const davetli = await prisma.davetli.findUnique({
    where: { ozelKod: kod },
    select: {
      id: true,
      linkGoruntulendiAt: true,
      davetiye: { select: { slug: true, aktif: true, odemeDurumu: true } },
    },
  });

  const hedef = new URL("/", req.url);

  if (!davetli?.davetiye?.aktif || davetli.davetiye.odemeDurumu !== "odendi") {
    return NextResponse.redirect(hedef);
  }

  const simdi = new Date();
  await prisma.davetli.update({
    where: { id: davetli.id },
    data: {
      ...(davetli.linkGoruntulendiAt === null && { linkGoruntulendiAt: simdi }),
      linkGoruntulenmeSayisi: { increment: 1 },
      sonGoruntulenmeAt: simdi,
    },
  });

  const hedefUrl = new URL(
    `/davetiye/${davetli.davetiye.slug}?dk=${encodeURIComponent(kod)}`,
    req.url,
  );
  return NextResponse.redirect(hedefUrl);
}
