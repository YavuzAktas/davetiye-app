import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ipAlNextRequest, ipIzinVer } from "@/lib/rate-limit";

const GORUNTULENME_PENCERE_MS = 6 * 60 * 60 * 1000;
const SLUG_DESENI = /^[A-Za-z0-9_-]{1,100}$/;

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
): Promise<NextResponse> {
  const { slug } = await params;
  const temizSlug = slug.trim();

  if (!SLUG_DESENI.test(temizSlug)) {
    return NextResponse.json({ hata: "Geçersiz davetiye." }, { status: 400 });
  }

  const ip = ipAlNextRequest(req);
  const izinli = await ipIzinVer(
    "davetiye-goruntulenme",
    `${temizSlug}:${ip}`,
    1,
    GORUNTULENME_PENCERE_MS,
  );

  if (!izinli) {
    return NextResponse.json({ basarili: true, sayildi: false });
  }

  await prisma.davetiye.updateMany({
    where: {
      slug: temizSlug,
      aktif: true,
    },
    data: {
      goruntulenme: { increment: 1 },
    },
  });

  return NextResponse.json({ basarili: true, sayildi: true });
}
