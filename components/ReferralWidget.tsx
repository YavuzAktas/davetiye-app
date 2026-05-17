"use client";

import { useState } from "react";

type Props = {
  referralKod: string;
  referralKredi: number;
  toplamReferral: number;
  odenenReferral: number;
};

export default function ReferralWidget({ referralKod, referralKredi, toplamReferral, odenenReferral }: Props) {
  const [kopyalandi, setKopyalandi] = useState(false);

  const baseUrl = typeof window !== "undefined" ? window.location.origin : process.env.NEXT_PUBLIC_URL ?? "";
  const referralLink = `${baseUrl}/r/${referralKod}`;

  const kopyala = () => {
    navigator.clipboard.writeText(referralLink).then(() => {
      setKopyalandi(true);
      setTimeout(() => setKopyalandi(false), 2000);
    }).catch(() => {});
  };

  return (
    <div className="bg-white border border-gray-100 rounded-3xl overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-5 pb-4 border-b border-gray-50">
        <div className="flex items-center gap-2.5 mb-1">
          <div className="w-7 h-7 rounded-xl bg-linear-to-br from-purple-500 to-pink-500 flex items-center justify-center text-sm">
            🎁
          </div>
          <p className="text-xs font-semibold text-gray-400 tracking-[0.15em] uppercase">Referral Programı</p>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {referralKredi > 0
            ? <><span className="font-semibold text-purple-600">{referralKredi}₺</span> krediniz bir sonraki ödemede kullanılabilir</>
            : <>Arkadaşın ödeme yaparsa <span className="font-semibold text-purple-600">50₺</span> kazan</>
          }
        </p>
      </div>

      <div className="p-5 space-y-4">
        {/* Credit balance */}
        {referralKredi > 0 && (
          <div className="rounded-2xl bg-linear-to-r from-purple-50 to-pink-50 border border-purple-100 p-4 text-center">
            <p className="text-3xl font-bold text-purple-700 tabular-nums">{referralKredi}₺</p>
            <p className="text-xs text-purple-400 mt-0.5">Kullanılabilir krediniz</p>
          </div>
        )}

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-2xl bg-gray-50 p-3 text-center">
            <p className="text-xl font-bold text-gray-800 tabular-nums">{toplamReferral}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Davet edilen</p>
          </div>
          <div className="rounded-2xl bg-gray-50 p-3 text-center">
            <p className="text-xl font-bold text-gray-800 tabular-nums">{odenenReferral}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Ödül kazanıldı</p>
          </div>
        </div>

        {/* Referral link */}
        <div>
          <p className="text-[11px] font-semibold text-gray-400 mb-2">Davet linkin</p>
          <div className="flex gap-2">
            <div className="flex-1 min-w-0 rounded-xl bg-gray-50 border border-gray-100 px-3 py-2.5">
              <p className="text-xs text-gray-500 truncate font-mono">{referralLink}</p>
            </div>
            <button
              type="button"
              onClick={kopyala}
              className="shrink-0 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all"
              style={{
                background: kopyalandi
                  ? "linear-gradient(135deg,#10b981,#059669)"
                  : "linear-gradient(135deg,#7c3aed,#db2777)",
                color: "#fff",
                border: "none",
                cursor: "pointer",
                minWidth: 72,
              }}
            >
              {kopyalandi ? "✓ Kopyalandı" : "Kopyala"}
            </button>
          </div>
        </div>

        <p className="text-[11px] text-gray-300 text-center leading-relaxed">
          Arkadaşın bu link ile kaydolup ödeme yaparsa sen 50₺, sonraki ödemenizde kullanabilirsiniz.
        </p>
      </div>
    </div>
  );
}
