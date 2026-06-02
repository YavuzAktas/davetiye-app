import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import type { Metadata } from "next";
import AktivasyonSayfasi from "./AktivasyonSayfasi";
import { dahilKodlarGetir } from "@/lib/partner-paketler";

export const metadata: Metadata = {
  title: "Aktivasyon | DavetRota",
  robots: { index: false },
};

const KULLANILMIS_DURUMLAR = new Set(["davetiye_olusturuldu", "yayinda"]);

const OZELLIK_ETIKETI: Record<string, { isim: string; emoji: string }> = {
  "temel-davetiye": { isim: "Dijital davetiye", emoji: "💌" },
  "luks-sablon": { isim: "Lüks şablon", emoji: "✨" },
  "muzik": { isim: "Arka plan müziği", emoji: "🎵" },
  "album-foto": { isim: "Fotoğraf albümü", emoji: "📸" },
  "ani-defteri": { isim: "Anı defteri", emoji: "📖" },
  "canli-duvar": { isim: "Canlı duvar", emoji: "📺" },
  "sesli-ani": { isim: "Sesli anı", emoji: "🎙️" },
  "oturma-plani": { isim: "Oturma planı", emoji: "🪑" },
  "qr-check-in": { isim: "QR check-in", emoji: "📱" },
  "ani-kitabi-pdf": { isim: "Anı kitabı PDF", emoji: "📚" },
};

export default async function AktivasyonPage({
  params,
}: {
  params: Promise<{ kod: string }>;
}) {
  const { kod } = await params;
  const simdi = new Date();

  const aktivasyon = await prisma.aktivasyonKodu.findUnique({
    where: { kod },
    include: {
      abonelik: { select: { aktif: true, bitisAt: true, paketId: true } },
      davetiye: {
        select: {
          slug: true,
          baslik: true,
          aktif: true,
          tarih: true,
        },
      },
      partner: {
        select: {
          firmaAdi: true,
          logoUrl: true,
          markaRenk: true,
          markaSlogani: true,
          destekTelefonu: true,
          instagramUrl: true,
          durum: true,
        },
      },
    },
  });

  /* ── Geçersiz / iptal ── */
  const linkGecersiz =
    !aktivasyon ||
    aktivasyon.durum === "iptal" ||
    aktivasyon.partner.durum !== "aktif" ||
    !!(aktivasyon.expiresAt && aktivasyon.expiresAt < simdi) ||
    !aktivasyon.abonelik ||
    !aktivasyon.abonelik.aktif ||
    !!(aktivasyon.abonelik.bitisAt && aktivasyon.abonelik.bitisAt < simdi);

  if (linkGecersiz) {
    return (
      <PageShell>
        <div className="text-center">
          <div className="w-20 h-20 bg-gray-100 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">🔗</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Geçersiz Link</h1>
          <p className="text-sm text-gray-500">Bu aktivasyon linki bulunamadı, iptal edildi veya süresi doldu.</p>
        </div>
      </PageShell>
    );
  }

  /* ── Başkası kullanmış ── */
  if (KULLANILMIS_DURUMLAR.has(aktivasyon.durum)) {
    // Kodu kullanan kişi mi bakıyor?
    const session = await getServerSession(authOptions);
    const kendisi = session?.user?.id && aktivasyon.musteriUserId === session.user.id;
    const dahilKodlar = aktivasyon.abonelik?.paketId ? dahilKodlarGetir(aktivasyon.abonelik.paketId) : [];

    return (
      <PageShell>
        {kendisi ? (
          <MusteriPortalOzeti
            firmaAdi={aktivasyon.partner.firmaAdi}
            logoUrl={aktivasyon.partner.logoUrl}
            marka={{
              renk: aktivasyon.partner.markaRenk,
              slogan: aktivasyon.partner.markaSlogani,
              destekTelefonu: aktivasyon.partner.destekTelefonu,
              instagramUrl: aktivasyon.partner.instagramUrl,
            }}
            durum={aktivasyon.durum}
            davetiye={aktivasyon.davetiye}
            dahilKodlar={dahilKodlar}
          />
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">✅</div>
            <h1 className="text-2xl font-black text-gray-900 mb-2">Bu Link Kullanıldı</h1>
            <p className="text-sm text-gray-500">Bu aktivasyon linki daha önce kullanıldı.</p>
          </div>
        )}
      </PageShell>
    );
  }

  /* ── Kullanılabilir ── */
  const dahilKodlar = dahilKodlarGetir(aktivasyon.abonelik!.paketId);

  return (
    <PageShell>
      <AktivasyonSayfasi
        kod={kod}
        firmaAdi={aktivasyon.partner.firmaAdi}
        logoUrl={aktivasyon.partner.logoUrl}
        marka={{
          renk: aktivasyon.partner.markaRenk,
          slogan: aktivasyon.partner.markaSlogani,
          destekTelefonu: aktivasyon.partner.destekTelefonu,
          instagramUrl: aktivasyon.partner.instagramUrl,
        }}
        dahilKodlar={dahilKodlar}
      />
    </PageShell>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:py-12">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-8 lg:p-10">
        {children}
      </div>
    </div>
  );
}

function MusteriPortalOzeti({
  firmaAdi,
  logoUrl,
  marka,
  durum,
  davetiye,
  dahilKodlar,
}: {
  firmaAdi: string;
  logoUrl: string | null;
  marka: {
    renk?: string | null;
    slogan?: string | null;
    destekTelefonu?: string | null;
    instagramUrl?: string | null;
  };
  durum: string;
  davetiye: {
    slug: string;
    baslik: string;
    aktif: boolean;
    tarih: Date | null;
  } | null;
  dahilKodlar: string[];
}) {
  const markaRenk = marka.renk || "#7c3aed";
  const gorunenOzellikler = dahilKodlar
    .filter(k => OZELLIK_ETIKETI[k])
    .sort((a, b) => (a === "temel-davetiye" ? -1 : b === "temel-davetiye" ? 1 : 0));
  const yayinDurumu = durum === "yayinda" || davetiye?.aktif;

  return (
    <div className="space-y-6">
      <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
        <div className="min-w-0">
          <div className="mb-6 flex items-center gap-3">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={`${firmaAdi} logosu`}
                className="h-12 w-12 rounded-2xl border border-gray-100 bg-white object-contain p-1.5 shadow-sm"
              />
            ) : (
              <div
                className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl font-black text-white"
                style={{ backgroundColor: markaRenk }}
              >
                {firmaAdi.slice(0, 1).toLocaleUpperCase("tr-TR")}
              </div>
            )}
            <div className="min-w-0">
              <p className="truncate text-sm font-black text-gray-950">{firmaAdi}</p>
              <p className="text-xs font-semibold" style={{ color: markaRenk }}>Müşteri teslim portalı</p>
            </div>
          </div>

          <p className="text-xs font-black uppercase tracking-[0.18em]" style={{ color: markaRenk }}>
            Dijital etkinlik paketi
          </p>
          <h1 className="mt-3 text-3xl font-black tracking-tight text-gray-950 sm:text-4xl">
            Davetiyeniz ve etkinlik araçlarınız hazır
          </h1>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-gray-500">
            Bu alan {firmaAdi} tarafından size verilen dijital teslim noktasıdır. Davetli listesi, RSVP yanıtları,
            fotoğraf ve anı içerikleri yalnızca sizin hesabınızdaki panelde yönetilir.
          </p>
          {marka.slogan && (
            <p
              className="mt-4 max-w-2xl rounded-2xl border px-4 py-3 text-sm font-semibold leading-relaxed"
              style={{ borderColor: `${markaRenk}22`, backgroundColor: `${markaRenk}10`, color: markaRenk }}
            >
              {marka.slogan}
            </p>
          )}
        </div>

        <div className="rounded-3xl border border-gray-100 bg-gray-50 p-4">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-gray-400">Durum</p>
          <div className="mt-3 rounded-2xl bg-white p-4 shadow-sm">
            <span
              className="inline-flex rounded-full px-3 py-1 text-xs font-black"
              style={{ backgroundColor: `${markaRenk}12`, color: markaRenk }}
            >
              {yayinDurumu ? "Yayında" : "Oluşturuldu"}
            </span>
            <p className="mt-3 text-lg font-black text-gray-950">
              {davetiye?.baslik || "Dijital davetiye"}
            </p>
            {davetiye?.tarih && (
              <p className="mt-1 text-xs font-semibold text-gray-500">
                {davetiye.tarih.toLocaleDateString("tr-TR", { day: "numeric", month: "long", year: "numeric" })}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <a
          href={davetiye ? `/dashboard/davetiye/${davetiye.slug}` : "/dashboard"}
          className="rounded-3xl bg-gray-950 p-5 text-white transition-colors hover:bg-purple-700"
        >
          <p className="text-sm font-black">Yönetim panelini aç</p>
          <p className="mt-2 text-xs leading-relaxed text-white/70">
            RSVP, davetliler, QR ve diğer etkinlik araçlarını buradan yönetin.
          </p>
        </a>
        {davetiye && (
          <a
            href={`/davetiye/${davetiye.slug}`}
            className="rounded-3xl border border-gray-100 bg-white p-5 transition-colors hover:border-purple-200 hover:bg-purple-50"
          >
            <p className="text-sm font-black text-gray-950">Davetiyeyi görüntüle</p>
            <p className="mt-2 text-xs leading-relaxed text-gray-500">
              Misafirlere göndereceğiniz canlı davetiye sayfasını açın.
            </p>
          </a>
        )}
        <a
          href="/dashboard"
          className="rounded-3xl border border-gray-100 bg-white p-5 transition-colors hover:border-purple-200 hover:bg-purple-50"
        >
          <p className="text-sm font-black text-gray-950">Tüm davetiyelerim</p>
          <p className="mt-2 text-xs leading-relaxed text-gray-500">
            Hesabınızdaki diğer davetiyeleri ve ayarları görüntüleyin.
          </p>
        </a>
      </div>

      {gorunenOzellikler.length > 0 && (
        <div className="rounded-3xl border border-gray-100 bg-white p-5">
          <p className="text-sm font-black text-gray-950">Paketinize dahil araçlar</p>
          <div className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            {gorunenOzellikler.map(kod => {
              const ozellik = OZELLIK_ETIKETI[kod]!;
              return (
                <div key={kod} className="flex items-center gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-3 py-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-base shadow-sm">
                    {ozellik.emoji}
                  </span>
                  <span className="text-sm font-bold text-gray-800">{ozellik.isim}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {(marka.destekTelefonu || marka.instagramUrl) && (
        <div className="flex flex-wrap gap-2 rounded-3xl border border-gray-100 bg-gray-50 p-4">
          {marka.destekTelefonu && (
            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 ring-1 ring-gray-100">
              Destek: {marka.destekTelefonu}
            </span>
          )}
          {marka.instagramUrl && (
            <a
              href={marka.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full bg-white px-3 py-1.5 text-xs font-bold text-gray-600 ring-1 ring-gray-100 hover:text-purple-600"
            >
              Instagram
            </a>
          )}
        </div>
      )}
    </div>
  );
}
