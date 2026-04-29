import Link from "next/link";

interface Bolum {
  baslik: string;
  icerik: React.ReactNode;
}

interface Props {
  etiket: string;
  baslik: string;
  sonGuncelleme: string;
  bolumler: Bolum[];
}

export default function YasalSayfa({ etiket, baslik, sonGuncelleme, bolumler }: Props) {
  return (
    <div className="min-h-screen bg-gray-50">

      {/* Üst bant */}
      <div className="bg-white border-b border-gray-100 px-4 py-10 text-center">
        <span className="inline-block text-xs font-semibold tracking-[0.22em] uppercase text-purple-500 mb-2">
          {etiket}
        </span>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{baslik}</h1>
        <p className="text-sm text-gray-400">Son güncelleme: {sonGuncelleme}</p>
      </div>

      {/* İçerik */}
      <div className="max-w-3xl mx-auto px-4 py-12">

        {/* Navigasyon */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-8 shadow-sm">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-3">İçindekiler</p>
          <div className="space-y-1">
            {bolumler.map((b, i) => (
              <a key={i} href={`#bolum-${i + 1}`}
                className="flex items-center gap-2 text-sm text-gray-600 hover:text-purple-600 transition-colors py-0.5">
                <span className="text-xs text-gray-300 font-mono w-5">{String(i + 1).padStart(2, "0")}</span>
                {b.baslik}
              </a>
            ))}
          </div>
        </div>

        {/* Bölümler */}
        <div className="space-y-6">
          {bolumler.map((b, i) => {
            const slug = b.baslik.toLocaleLowerCase("tr").replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
            return (
            <div key={i} id={`bolum-${i + 1}`}
              className="bg-white rounded-2xl border border-gray-100 p-7 shadow-sm scroll-mt-24">
              <span id={slug} className="sr-only" />
              <div className="flex items-start gap-4 mb-4">
                <span className="text-xs font-mono text-gray-300 mt-1">{String(i + 1).padStart(2, "0")}</span>
                <h2 className="text-lg font-bold text-gray-900">{b.baslik}</h2>
              </div>
              <div className="pl-8 prose prose-sm prose-gray max-w-none
                [&_p]:text-gray-600 [&_p]:leading-relaxed [&_p]:mb-3
                [&_ul]:space-y-1.5 [&_ul]:my-3
                [&_li]:text-gray-600 [&_li]:leading-relaxed
                [&_strong]:text-gray-800 [&_strong]:font-semibold
                [&_a]:text-purple-600 [&_a]:underline [&_a]:underline-offset-2
                [&_table]:w-full [&_table]:text-sm [&_table]:border-collapse
                [&_th]:text-left [&_th]:text-gray-500 [&_th]:font-semibold [&_th]:pb-2 [&_th]:border-b [&_th]:border-gray-100
                [&_td]:py-2 [&_td]:border-b [&_td]:border-gray-50 [&_td]:text-gray-600">
                {b.icerik}
              </div>
            </div>
          );
          })}
        </div>

        {/* Alt — diğer belgeler */}
        <div className="mt-10 pt-8 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-400 mb-4">İlgili belgeler</p>
          <div className="flex justify-center gap-4 flex-wrap">
            <Link href="/kvkk" className="text-sm text-purple-600 hover:underline">KVKK Aydınlatma Metni</Link>
            <Link href="/gizlilik" className="text-sm text-purple-600 hover:underline">Gizlilik Politikası</Link>
            <Link href="/kullanim-sartlari" className="text-sm text-purple-600 hover:underline">Kullanım Şartları</Link>
            <Link href="/iletisim" className="text-sm text-purple-600 hover:underline">İletişim</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
