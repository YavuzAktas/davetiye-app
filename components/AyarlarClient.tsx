"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import Link from "next/link";

interface Props {
  plan: string;
  planIsim: string;
}

export default function AyarlarClient({ plan, planIsim }: Props) {
  const [cikisOnay, setCikisOnay] = useState(false);
  const [silOnay, setSilOnay] = useState(false);
  const [silYazisi, setSilYazisi] = useState("");
  const [silYukleniyor, setSilYukleniyor] = useState(false);
  const [exportYukleniyor, setExportYukleniyor] = useState(false);

  async function hesabiSil() {
    if (silYazisi !== "SİL" || silYukleniyor) return;
    setSilYukleniyor(true);
    try {
      const res = await fetch("/api/kullanici/sil", { method: "DELETE" });
      if (!res.ok) throw new Error();
      await signOut({ callbackUrl: "/" });
    } catch {
      setSilYukleniyor(false);
      alert("Bir hata oluştu, tekrar deneyin.");
    }
  }

  async function veriIndir() {
    setExportYukleniyor(true);
    try {
      const res = await fetch("/api/kullanici/export");
      if (!res.ok) throw new Error();
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `davetim-verilerim-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert("Veri indirilemedi, tekrar deneyin.");
    } finally {
      setExportYukleniyor(false);
    }
  }

  return (
    <div className="space-y-4">

      {/* Plan yükselt / geç CTA */}
      {plan === "free" && (
        <div className="relative bg-[#0f0118] rounded-3xl overflow-hidden p-6">
          <div className="absolute -top-8 -right-8 w-32 h-32 bg-purple-600 opacity-20 blur-3xl rounded-full" />
          <div className="absolute inset-0 opacity-[0.04]" style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }} />
          <div className="relative">
            <p className="text-purple-300 text-xs font-semibold tracking-[0.15em] uppercase mb-1">Planını Yükselt</p>
            <h3 className="text-white text-lg font-bold mb-1">Daha fazlasını keşfet</h3>
            <p className="text-white/40 text-sm mb-4">Standart ile 5, Premium ile sınırsız davetiye oluştur.</p>
            <Link
              href="/fiyatlar"
              className="inline-flex items-center gap-2 bg-linear-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:opacity-90 transition-all"
            >
              Planları Gör →
            </Link>
          </div>
        </div>
      )}

      {plan === "standart" && (
        <div className="relative bg-linear-to-br from-amber-500 to-orange-500 rounded-3xl overflow-hidden p-6">
          <div className="absolute inset-0 opacity-[0.06]" style={{
            backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
            backgroundSize: "16px 16px",
          }} />
          <div className="relative">
            <p className="text-white/60 text-xs font-semibold tracking-[0.15em] uppercase mb-1">Premium&apos;a Geç</p>
            <h3 className="text-white text-lg font-bold mb-1">👑 Sınırsız her şey</h3>
            <p className="text-white/70 text-sm mb-4">Müzik, analitik, sınırsız davetiye ve öncelikli destek.</p>
            <Link
              href="/fiyatlar"
              className="inline-flex items-center gap-2 bg-white text-amber-600 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-amber-50 transition-all"
            >
              Premium&apos;a Yükselt →
            </Link>
          </div>
        </div>
      )}

      {/* Veri Export — KVKK m.11 veri taşınabilirlik hakkı */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6">
        <p className="text-xs font-semibold text-gray-400 tracking-[0.15em] uppercase mb-4">Verilerim</p>
        <button
          onClick={veriIndir}
          disabled={exportYukleniyor}
          className="flex items-center gap-3 w-full p-3.5 rounded-2xl border border-gray-200 hover:border-blue-200 hover:bg-blue-50 transition-all group disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <div className="w-9 h-9 bg-blue-50 group-hover:bg-blue-100 rounded-xl flex items-center justify-center text-lg transition-colors shrink-0">
            📥
          </div>
          <div className="text-left">
            <p className="text-sm font-semibold text-gray-700 group-hover:text-blue-700 transition-colors">
              {exportYukleniyor ? "Hazırlanıyor..." : "Verilerimi İndir"}
            </p>
            <p className="text-xs text-gray-400">KVKK m.11 kapsamında tüm verilerini JSON olarak al</p>
          </div>
        </button>
      </div>

      {/* Çıkış Yap */}
      <div className="bg-white border border-gray-100 rounded-3xl p-6">
        <p className="text-xs font-semibold text-gray-400 tracking-[0.15em] uppercase mb-4">Oturum</p>

        {!cikisOnay ? (
          <button
            onClick={() => setCikisOnay(true)}
            className="flex items-center gap-3 w-full p-3.5 rounded-2xl border border-gray-200 hover:border-orange-200 hover:bg-orange-50 transition-all group"
          >
            <div className="w-9 h-9 bg-orange-50 group-hover:bg-orange-100 rounded-xl flex items-center justify-center text-lg transition-colors">
              🚪
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-700 group-hover:text-orange-700 transition-colors">Çıkış Yap</p>
              <p className="text-xs text-gray-400">Hesabından güvenli çıkış yap</p>
            </div>
          </button>
        ) : (
          <div className="border border-orange-200 bg-orange-50 rounded-2xl p-4">
            <p className="text-sm font-semibold text-orange-800 mb-3">Çıkış yapmak istediğinden emin misin?</p>
            <div className="flex gap-2">
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex-1 bg-orange-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-orange-600 transition-colors"
              >
                Evet, Çıkış Yap
              </button>
              <button
                onClick={() => setCikisOnay(false)}
                className="flex-1 bg-white border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Tehlikeli Bölge */}
      <div className="bg-white border border-red-100 rounded-3xl p-6">
        <p className="text-xs font-semibold text-red-400 tracking-[0.15em] uppercase mb-4">Tehlikeli Bölge</p>

        {!silOnay ? (
          <button
            onClick={() => setSilOnay(true)}
            className="flex items-center gap-3 w-full p-3.5 rounded-2xl border border-red-100 hover:border-red-300 hover:bg-red-50 transition-all group"
          >
            <div className="w-9 h-9 bg-red-50 group-hover:bg-red-100 rounded-xl flex items-center justify-center text-lg transition-colors">
              🗑️
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-gray-700 group-hover:text-red-700 transition-colors">Hesabı Sil</p>
              <p className="text-xs text-gray-400">Tüm davetiyeler ve veriler kalıcı olarak silinir</p>
            </div>
          </button>
        ) : (
          <div className="border border-red-200 bg-red-50 rounded-2xl p-4">
            <p className="text-sm font-semibold text-red-800 mb-1">Bu işlem geri alınamaz!</p>
            <p className="text-xs text-red-600 mb-3">
              Onaylamak için aşağıya <strong>SİL</strong> yaz:
            </p>
            <input
              type="text"
              value={silYazisi}
              onChange={e => setSilYazisi(e.target.value)}
              placeholder="SİL"
              className="w-full border-2 border-red-200 rounded-xl px-4 py-2.5 text-sm mb-3 focus:outline-none focus:border-red-400 bg-white"
            />
            <div className="flex gap-2">
              <button
                onClick={hesabiSil}
                disabled={silYazisi !== "SİL" || silYukleniyor}
                className="flex-1 bg-red-500 text-white py-2.5 rounded-xl text-sm font-bold hover:bg-red-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                {silYukleniyor ? "Siliniyor..." : "Hesabı Kalıcı Sil"}
              </button>
              <button
                onClick={() => { setSilOnay(false); setSilYazisi(""); }}
                className="flex-1 bg-white border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                İptal
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  );
}
