import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    include: {
      davetiyeler: {
        include: {
          rsvplar:   true,
          davetliler: true,
        },
      },
    },
  });

  if (!user) {
    return NextResponse.json({ hata: "Kullanıcı bulunamadı." }, { status: 404 });
  }

  const veri = {
    dışaAktarımTarihi: new Date().toISOString(),
    kullanici: {
      id:           user.id,
      ad:           user.name,
      email:        user.email,
      plan:         user.plan,
      kvkkOnay:     user.kvkkOnay,
      kvkkOnayTarih: user.kvkkOnayTarih,
      kayitTarihi:  user.createdAt,
    },
    davetiyeler: user.davetiyeler.map(d => ({
      id:            d.id,
      slug:          d.slug,
      sablon:        d.sablon,
      aktif:         d.aktif,
      olusturmaTarihi: d.createdAt,
      rsvplar: d.rsvplar.map(r => ({
        ad:         r.ad,
        email:      r.email,
        telefon:    r.telefon,
        katilim:    r.katilim,
        kisiSayisi: r.kisiSayisi,
        mesaj:      r.mesaj,
        tarih:      r.createdAt,
      })),
      davetliler: d.davetliler.map(dl => ({
        ad:    dl.ad,
        email: dl.email,
        tarih: dl.createdAt,
      })),
    })),
  };

  return new NextResponse(JSON.stringify(veri, null, 2), {
    status: 200,
    headers: {
      "Content-Type": "application/json",
      "Content-Disposition": `attachment; filename="bekleriz-verilerim-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
