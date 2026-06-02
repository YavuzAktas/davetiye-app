import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { ipIzinVer } from "@/lib/rate-limit";

export async function GET(): Promise<NextResponse> {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ hata: "Giriş gerekli." }, { status: 401 });
  }

  // Günde en fazla 3 export.
  if (!(await ipIzinVer("kullanici-export", session.user.id, 3, 24 * 60 * 60_000))) {
    return NextResponse.json({ hata: "Günlük veri dışa aktarma limitine ulaştınız." }, { status: 429 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      kvkkOnay: true,
      kvkkOnayTarih: true,
      createdAt: true,
      updatedAt: true,
      odemeKayitlari: {
        select: {
          planId: true,
          paymentStatus: true,
          paidPrice: true,
          currency: true,
          createdAt: true,
        },
      },
      davetiyeler: {
        select: {
          id: true,
          slug: true,
          baslik: true,
          etkinlikTur: true,
          tarih: true,
          mekan: true,
          mesaj: true,
          sablon: true,
          muzik: true,
          aktif: true,
          goruntulenme: true,
          font: true,
          ozelRenk: true,
          kisi1: true,
          kisi2: true,
          polaroid1: true,
          polaroid2: true,
          polaroid3: true,
          sesliAniAktif: true,
          canliDuvarAktif: true,
          aniDefteriAktif: true,
          albumAktif: true,
          dressKod: true,
          dressKodRenkler: true,
          createdAt: true,
          updatedAt: true,
          rsvplar: {
            select: {
              ad: true,
              email: true,
              telefon: true,
              katilim: true,
              kisiSayisi: true,
              mesaj: true,
              diyet: true,
              sarkiOnerisi: true,
              ozelNitelikliVeriOnaylandiAt: true,
              ozelNitelikliVeriMetinSurumu: true,
              createdAt: true,
              updatedAt: true,
              masaAtamasi: {
                select: {
                  createdAt: true,
                  masa: {
                    select: {
                      isim: true,
                      kapasite: true,
                      sira: true,
                    },
                  },
                },
              },
            },
          },
          davetliler: {
            select: {
              ad: true,
              telefon: true,
              email: true,
              createdAt: true,
              updatedAt: true,
            },
          },
          albumFotolar: {
            select: {
              yukleyenAd: true,
              dosyaUrl: true,
              onaylandi: true,
              createdAt: true,
            },
          },
          aniDefterleri: {
            select: {
              yazarAd: true,
              icerik: true,
              onaylandi: true,
              createdAt: true,
            },
          },
          sesliAnilar: {
            select: {
              adSoyad: true,
              dosyaUrl: true,
              sure: true,
              onaylandi: true,
              createdAt: true,
            },
          },
          masalar: {
            select: {
              isim: true,
              kapasite: true,
              sira: true,
              createdAt: true,
              atamalar: {
                select: {
                  createdAt: true,
                  rsvp: {
                    select: {
                      ad: true,
                      email: true,
                      telefon: true,
                      kisiSayisi: true,
                    },
                  },
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
      kvkkOnay:     user.kvkkOnay,
      kvkkOnayTarih: user.kvkkOnayTarih,
      kayitTarihi:  user.createdAt,
      guncellemeTarihi: user.updatedAt,
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
      polaroidler:   [d.polaroid1, d.polaroid2, d.polaroid3].filter(Boolean),
      sesliAniAktif:   d.sesliAniAktif,
      canliDuvarAktif: d.canliDuvarAktif,
      aniDefteriAktif: d.aniDefteriAktif,
      albumAktif:      d.albumAktif,
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
        ozelNitelikliVeriOnaylandiAt: r.ozelNitelikliVeriOnaylandiAt,
        ozelNitelikliVeriMetinSurumu: r.ozelNitelikliVeriMetinSurumu,
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
      "Content-Disposition": `attachment; filename="davetrota-verilerim-${new Date().toISOString().slice(0, 10)}.json"`,
    },
  });
}
