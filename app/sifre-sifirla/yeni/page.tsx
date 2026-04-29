"use client";

import { Suspense, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";

function YeniSifreIcerigi() {
  const searchParams          = useSearchParams();
  const router                = useRouter();
  const token                 = searchParams.get("token") ?? "";

  const [sifre,    setSifre]  = useState("");
  const [sifre2,   setSifre2] = useState("");
  const [yukleniyor, setYuk]  = useState(false);
  const [hata,    setHata]    = useState("");
  const [basarili, setBas]    = useState(false);

  if (!token) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">⚠️</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Geçersiz bağlantı</h1>
        <p className="text-sm text-gray-500 mb-4">Bu sayfa doğrudan açılamaz.</p>
        <Link href="/sifre-sifirla" className="text-purple-600 text-sm font-semibold hover:underline">
          Yeni sıfırlama talebi oluştur
        </Link>
      </div>
    );
  }

  async function kaydet(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    if (sifre !== sifre2) { setHata("Şifreler eşleşmiyor."); return; }
    if (sifre.length < 8)  { setHata("Şifre en az 8 karakter olmalıdır."); return; }
    setYuk(true);
    try {
      const res = await fetch("/api/auth/sifre-sifirla/guncelle", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, sifre }),
      });
      const veri = await res.json();
      if (!res.ok) { setHata(veri.hata); return; }
      setBas(true);
      setTimeout(() => router.push("/giris"), 2500);
    } catch {
      setHata("Bir hata oluştu, tekrar deneyin.");
    } finally {
      setYuk(false);
    }
  }

  if (basarili) {
    return (
      <div className="text-center">
        <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">✅</div>
        <h1 className="text-xl font-bold text-gray-900 mb-2">Şifre güncellendi!</h1>
        <p className="text-sm text-gray-500">Giriş sayfasına yönlendiriliyorsunuz...</p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Yeni Şifre Belirle</h1>
        <p className="text-sm text-gray-400">En az 8 karakter içermelidir.</p>
      </div>

      <form onSubmit={kaydet} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Yeni Şifre</label>
          <input
            type="password"
            value={sifre}
            onChange={e => setSifre(e.target.value)}
            placeholder="En az 8 karakter"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre Tekrar</label>
          <input
            type="password"
            value={sifre2}
            onChange={e => setSifre2(e.target.value)}
            placeholder="Şifrenizi tekrar girin"
            required
            className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
          />
        </div>

        {hata && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{hata}</p>
        )}

        <button
          type="submit"
          disabled={yukleniyor || !sifre || !sifre2}
          className="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {yukleniyor ? "Kaydediliyor..." : "Şifremi Güncelle"}
        </button>
      </form>
    </>
  );
}

export default function YeniSifreSayfasi() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 bg-linear-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Davetim</span>
          </Link>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <Suspense fallback={<div className="text-center text-gray-400 text-sm">Yükleniyor...</div>}>
            <YeniSifreIcerigi />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
