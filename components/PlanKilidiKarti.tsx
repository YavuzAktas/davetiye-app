import Link from "next/link";

type Props = {
  ozellik: string;
  aciklama: string;
  gerekenPlan: "standart" | "premium";
};

export default function PlanKilidiKarti({ ozellik, aciklama, gerekenPlan }: Props) {
  const isPremium = gerekenPlan === "premium";

  return (
    <div className="bg-white border border-gray-100 rounded-3xl px-6 py-16 sm:py-20 text-center max-w-lg mx-auto">
      <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-3xl mx-auto mb-6 ${
        isPremium ? "bg-amber-50" : "bg-purple-50"
      }`}>
        🔒
      </div>

      <p className={`text-xs font-bold tracking-widest uppercase mb-3 ${
        isPremium ? "text-amber-500" : "text-purple-500"
      }`}>
        {isPremium ? "👑 Premium" : "⭐ Standart"} özelliği
      </p>

      <h2 className="text-xl font-bold text-gray-900 mb-3">{ozellik}</h2>
      <p className="text-gray-500 text-sm leading-relaxed mb-8 max-w-xs mx-auto">{aciklama}</p>

      <Link
        href="/fiyatlar"
        className={`inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-2xl font-bold text-sm hover:opacity-90 hover:shadow-lg transition-all ${
          isPremium
            ? "bg-linear-to-r from-amber-500 to-orange-500 hover:shadow-amber-500/25"
            : "bg-linear-to-r from-purple-600 to-pink-600 hover:shadow-purple-500/25"
        }`}
      >
        {isPremium ? "👑" : "⭐"} Planını Yükselt →
      </Link>

      <p className="text-xs text-gray-300 mt-4">
        Mevcut planınla bu özelliğe erişilemiyor
      </p>
    </div>
  );
}
