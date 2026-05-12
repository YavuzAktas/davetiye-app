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
      odemeKayitlari: true,
      davetiyeler: {
        include: {
          rsvplar: {
            include: {
              masaAtamasi: {
                include: {
                  masa: true,
                },
              },
            },
          },
          davetliler: true,
          albumFotolar: true,
          aniDefterleri: true,
          sesliAnilar: true,
          masalar: {
            include: {
              atamalar: {
                include: {
                  rsvp: true,
                },
              },
            },
          },
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
      guncellemeTarihi: user.updatedAt,
      spotifyHesapId: user.spotifyId,
      spotifyBaglantisiVar: Boolean(user.spotifyRefreshToken),
    },
    odemeKayitlari: user.odemeKayitlari.map(o => ({
      plan: o.planId,
      odemeDurumu: o.paymentStatus,
      tutar: o.paidPrice,
      paraBirimi: o.currency,
      tarih: o.createdAt,
    })),
    davetiyeler: user.davetiyeler.map(d => ({
      id:            d.id,
      slug:          d.slug,
      baslik:        d.baslik,
      etkinlikTur:   d.etkinlikTur,
      tarih:         d.tarih,
      mekan:         d.mekan,
      mesaj:         d.mesaj,
      sablon:        d.sablon,
      muzik:         d.muzik,
      aktif:         d.aktif,
      goruntulenme:  d.goruntulenme,
      font:          d.font,
      ozelRenk:      d.ozelRenk,
      kisi1:         d.kisi1,
      kisi2:         d.kisi2,
      spotifyPlaylistId: d.spotifyPlaylistId,
      spotifyAktif:  d.spotifyAktif,
      polaroidler:   [d.polaroid1, d.polaroid2, d.polaroid3].filter(Boolean),
      sesliAniAktif: d.sesliAniAktif,
      canliDuvarAktif: d.canliDuvarAktif,
      albumAktif:    d.albumAktif,
      dressKod:      d.dressKod,
      dressKodRenkler: d.dressKodRenkler,
      olusturmaTarihi: d.createdAt,
      guncellemeTarihi: d.updatedAt,
      rsvplar: d.rsvplar.map(r => ({
        ad:         r.ad,
        email:      r.email,
        telefon:    r.telefon,
        katilim:    r.katilim,
        kisiSayisi: r.kisiSayisi,
        mesaj:      r.mesaj,
        diyet:      r.diyet,
        sarkiOnerisi: r.sarkiOnerisi,
        spotifyTrackId: r.spotifyTrackId,
        masa:       r.masaAtamasi?.masa
          ? {
              isim: r.masaAtamasi.masa.isim,
              kapasite: r.masaAtamasi.masa.kapasite,
              sira: r.masaAtamasi.masa.sira,
              atamaTarihi: r.masaAtamasi.createdAt,
            }
          : null,
        tarih:      r.createdAt,
        guncellemeTarihi: r.updatedAt,
      })),
      davetliler: d.davetliler.map(dl => ({
        ad:       dl.ad,
        telefon:  dl.telefon,
        email:    dl.email,
        notlar:   dl.notlar,
        tarih:    dl.createdAt,
        guncellemeTarihi: dl.updatedAt,
      })),
      albumFotolari: d.albumFotolar.map(f => ({
        yukleyenAd: f.yukleyenAd,
        dosyaUrl: f.dosyaUrl,
        onaylandi: f.onaylandi,
        tarih: f.createdAt,
      })),
      aniDefteri: d.aniDefterleri.map(a => ({
        yazarAd: a.yazarAd,
        icerik: a.icerik,
        onaylandi: a.onaylandi,
        tarih: a.createdAt,
      })),
      sesliAnilar: d.sesliAnilar.map(s => ({
        adSoyad: s.adSoyad,
        dosyaUrl: s.dosyaUrl,
        sure: s.sure,
        onaylandi: s.onaylandi,
        tarih: s.createdAt,
      })),
      masalar: d.masalar.map(m => ({
        isim: m.isim,
        kapasite: m.kapasite,
        sira: m.sira,
        tarih: m.createdAt,
        atamalar: m.atamalar.map(a => ({
          rsvpAd: a.rsvp.ad,
          rsvpEmail: a.rsvp.email,
          rsvpTelefon: a.rsvp.telefon,
          kisiSayisi: a.rsvp.kisiSayisi,
          tarih: a.createdAt,
        })),
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
