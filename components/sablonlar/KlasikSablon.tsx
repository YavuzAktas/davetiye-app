import { SablonProps } from "@/lib/sablon-tipleri";
import { SABLONLAR } from "@/lib/sablonlar";
import Link from "next/link";
import { FadeUp, FadeIn, ScaleIn } from "@/components/DavetiyeAnimasyon";
import MuzikCalar from "@/components/MuzikCalar";

export default function KlasikSablon({ davetiye, rsvpBileseni }: SablonProps) {
  const sablon = SABLONLAR.find((s) => s.id === davetiye.sablon) || SABLONLAR[0];
  const aktifRenk = davetiye.ozelRenk || sablon.renk;
  const aktifFont =
    davetiye.font === "font-serif" ? "Georgia, serif"
    : davetiye.font === "font-mono" ? "monospace"
    : "system-ui, sans-serif";

  const tarihStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleDateString("tr-TR", {
        weekday: "long", day: "numeric", month: "long", year: "numeric",
      })
    : null;

  const saatStr = davetiye.tarih
    ? new Date(davetiye.tarih).toLocaleTimeString("tr-TR", {
        hour: "2-digit", minute: "2-digit",
      })
    : null;

  const whatsappMetin = encodeURIComponent(
    davetiye.baslik + "\n" +
    (tarihStr ? tarihStr + "\n" : "") +
    (davetiye.mekan ? davetiye.mekan + "\n" : "") +
    "Davetiye: " + process.env.NEXT_PUBLIC_URL + "/davetiye/" + davetiye.slug
  );

  const emojiler: Record<string, string> = {
    dugun: "💍", nisan: "💑", dogumgunu: "🎂",
    sunnet: "⭐", kina: "🌿", kurumsal: "🎯", diger: "🎉",
  };

  const etiketler: Record<string, string> = {
    dugun: "Düğün Davetiyesi", nisan: "Nişan Davetiyesi",
    dogumgunu: "Doğum Günü Partisi", sunnet: "Sünnet Töreni",
    kina: "Kına Gecesi", kurumsal: "Etkinlik Davetiyesi", diger: "Davetiye",
  };

  const bglar: Record<string, string> = {
    dugun: "from-rose-50 via-white to-white",
    nisan: "from-pink-50 via-white to-white",
    dogumgunu: "from-amber-50 via-white to-white",
    sunnet: "from-blue-50 via-white to-white",
    kina: "from-orange-50 via-white to-white",
    kurumsal: "from-slate-50 via-white to-white",
    diger: "from-purple-50 via-white to-white",
  };

  const emoji = emojiler[davetiye.etkinlikTur] ?? "🎉";
  const etiket = etiketler[davetiye.etkinlikTur] ?? "Davetiye";
  const bg = bglar[davetiye.etkinlikTur] ?? "from-purple-50 via-white to-white";

  const simdi = new Date();
  const fark = davetiye.tarih ? new Date(davetiye.tarih).getTime() - simdi.getTime() : -1;
  const gun = Math.floor(fark / (1000 * 60 * 60 * 24));
  const saat = Math.floor((fark % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const geriSayimVar = fark > 0;

  const haritaUrl = davetiye.mekan
    ? "https://maps.google.com/?q=" + encodeURIComponent(davetiye.mekan)
    : null;

  return (
    <div className={"min-h-screen bg-linear-to-b " + bg}>
      {davetiye.muzik && <MuzikCalar muzikUrl={davetiye.muzik} />}
      <div className="h-2 w-full" style={{ backgroundColor: aktifRenk }} />
      <div className="max-w-md mx-auto px-4 py-10">

        <FadeIn delay={0}>
          <div className="text-center mb-8">
            <ScaleIn delay={0.1}>
              <div className="mb-4 text-5xl">{emoji}</div>
            </ScaleIn>
            <FadeUp delay={0.2}>
              <p className="text-xs font-semibold tracking-widest uppercase mb-3" style={{ color: aktifRenk }}>
                {etiket}
              </p>
            </FadeUp>
            <FadeUp delay={0.3}>
              <h1 className="text-3xl font-bold leading-snug mb-4 text-gray-800" style={{ fontFamily: aktifFont }}>
                {davetiye.baslik}
              </h1>
            </FadeUp>
            {davetiye.mesaj && (
              <FadeUp delay={0.4}>
                <p className="text-gray-500 text-sm italic leading-relaxed max-w-xs mx-auto">
                  {davetiye.mesaj}
                </p>
              </FadeUp>
            )}
          </div>
        </FadeIn>

        <FadeIn delay={0.45}>
          <div className="flex items-center gap-3 mb-8">
            <div className="flex-1 h-px bg-gray-200" />
            <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: aktifRenk }} />
            <div className="flex-1 h-px bg-gray-200" />
          </div>
        </FadeIn>

        <FadeUp delay={0.5}>
          <div className="space-y-3 mb-6">
            {tarihStr && (
              <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: aktifRenk + "22" }}>
                  📅
                </div>
                <div>
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Tarih ve Saat</p>
                  <p className="font-semibold text-gray-800 text-sm">{tarihStr}</p>
                  {saatStr && saatStr !== "00:00" && (
                    <p className="text-gray-500 text-sm">Saat {saatStr}</p>
                  )}
                </div>
              </div>
            )}
            {davetiye.mekan && (
              <div className="bg-white rounded-2xl p-5 flex items-center gap-4 shadow-sm border border-gray-100">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-xl shrink-0" style={{ backgroundColor: aktifRenk + "22" }}>
                  📍
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-400 uppercase tracking-wide mb-0.5">Mekan</p>
                  <p className="font-semibold text-gray-800 text-sm truncate">{davetiye.mekan}</p>
                  {haritaUrl && (
                    <a href={haritaUrl} target="_blank" rel="noopener noreferrer" className="text-xs font-medium mt-0.5 inline-block text-blue-500">
                      Haritada Gör
                    </a>
                  )}
                </div>
              </div>
            )}
          </div>
        </FadeUp>

        {geriSayimVar && (
          <FadeUp delay={0.6}>
            <div className="rounded-2xl p-5 mb-4 text-center border" style={{ backgroundColor: aktifRenk + "15", borderColor: aktifRenk + "30" }}>
              <p className="text-xs font-medium uppercase tracking-wide mb-3" style={{ color: aktifRenk }}>
                Etkinliğe Kalan Süre
              </p>
              <div className="flex justify-center gap-6">
                <div>
                  <p className="text-3xl font-bold" style={{ color: aktifRenk }}>{gun}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Gün</p>
                </div>
                <div className="text-2xl font-light text-gray-300 flex items-center">:</div>
                <div>
                  <p className="text-3xl font-bold" style={{ color: aktifRenk }}>{saat}</p>
                  <p className="text-xs text-gray-400 mt-0.5">Saat</p>
                </div>
              </div>
            </div>
          </FadeUp>
        )}

        <FadeUp delay={0.7}>
          <div className="mb-4">{rsvpBileseni}</div>
        </FadeUp>

        <FadeUp delay={0.8}>
          <a href={"https://wa.me/?text=" + whatsappMetin} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center gap-2 bg-green-500 text-white py-3.5 rounded-2xl font-medium hover:bg-green-600 transition-colors mb-6">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
            </svg>
            Davetiyeyi Paylaş
          </a>
        </FadeUp>

        <FadeIn delay={0.9}>
          <p className="text-center text-xs text-gray-300">
            <Link href="/" className="hover:text-gray-400 transition-colors">davetim.com</Link>
            {" "}ile oluşturuldu
          </p>
        </FadeIn>

      </div>
    </div>
  );
}