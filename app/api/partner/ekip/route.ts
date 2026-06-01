import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { z } from "zod";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ipIzinVer } from "@/lib/rate-limit";
import {
  partnerEkipRolEtiketi,
  partnerEkipRolGecerliMi,
  partnerEkipTokenHash,
  partnerEkipTokenOlustur,
  PARTNER_EKIP_ROLLERI,
} from "@/lib/partner-ekip-erisim";

const olusturSemasi = z.object({
  rol: z.string().trim().default(PARTNER_EKIP_ROLLERI.operasyon),
  etiket: z.string().trim().max(80).optional().nullable(),
  gun: z.coerce.number().int().min(1).max(30).default(7),
}).strict();

function erisimLinki(req: NextRequest, token: string) {
  const base = process.env.NEXT_PUBLIC_URL || req.nextUrl.origin;
  return `${base}/partner/ekip/${token}`;
}

async function aktifPartnerBul(userId: string) {
  const simdi = new Date();
  const partner = await prisma.partner.findUnique({
    where: { userId },
    select: { id: true, durum: true },
  });

  if (!partner || partner.durum !== "aktif") return null;

  const abonelik = await prisma.partnerAbonelik.findFirst({
    where: {
      partnerId: partner.id,
      aktif: true,
      OR: [{ bitisAt: null }, { bitisAt: { gt: simdi } }],
    },
    select: { id: true },
  });

  return abonelik ? partner : null;
}

function erisimJson(erisim: {
  id: string;
  rol: string;
  etiket: string | null;
  aktif: boolean;
  expiresAt: Date | null;
  lastUsedAt: Date | null;
  revokedAt: Date | null;
  createdAt: Date;
}) {
  return {
    ...erisim,
    rolEtiketi: partnerEkipRolEtiketi(erisim.rol),
    expiresAt: erisim.expiresAt?.toISOString() ?? null,
    lastUsedAt: erisim.lastUsedAt?.toISOString() ?? null,
    revokedAt: erisim.revokedAt?.toISOString() ?? null,
    createdAt: erisim.createdAt.toISOString(),
  };
}

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  const partner = await aktifPartnerBul(session.user.id);
  if (!partner) return NextResponse.json({ hata: "Aktif partner aboneliği gerekli." }, { status: 403 });

  const erisimler = await prisma.partnerEkipErisim.findMany({
    where: { partnerId: partner.id },
    orderBy: { createdAt: "desc" },
    take: 30,
    select: {
      id: true,
      rol: true,
      etiket: true,
      aktif: true,
      expiresAt: true,
      lastUsedAt: true,
      revokedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({ erisimler: erisimler.map(erisimJson) });
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });

  if (!(await ipIzinVer("partner-ekip", session.user.id, 20, 60 * 60_000))) {
    return NextResponse.json({ hata: "Saatlik ekip erişimi limitine ulaştınız." }, { status: 429 });
  }

  const sonuc = olusturSemasi.safeParse(await req.json().catch(() => null));
  if (!sonuc.success || !partnerEkipRolGecerliMi(sonuc.data.rol)) {
    return NextResponse.json({ hata: "Geçersiz ekip erişimi." }, { status: 400 });
  }

  const partner = await aktifPartnerBul(session.user.id);
  if (!partner) return NextResponse.json({ hata: "Aktif partner aboneliği gerekli." }, { status: 403 });

  const aktifSayisi = await prisma.partnerEkipErisim.count({
    where: {
      partnerId: partner.id,
      aktif: true,
      OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
    },
  });
  if (aktifSayisi >= 10) {
    return NextResponse.json({ hata: "En fazla 10 aktif ekip linki olabilir." }, { status: 409 });
  }

  const token = partnerEkipTokenOlustur();
  const expiresAt = new Date(Date.now() + sonuc.data.gun * 24 * 60 * 60 * 1000);
  const erisim = await prisma.partnerEkipErisim.create({
    data: {
      partnerId: partner.id,
      rol: sonuc.data.rol,
      etiket: sonuc.data.etiket || null,
      tokenHash: partnerEkipTokenHash(token),
      expiresAt,
    },
    select: {
      id: true,
      rol: true,
      etiket: true,
      aktif: true,
      expiresAt: true,
      lastUsedAt: true,
      revokedAt: true,
      createdAt: true,
    },
  });

  return NextResponse.json({
    erisim: erisimJson(erisim),
    link: erisimLinki(req, token),
  }, { status: 201 });
}
