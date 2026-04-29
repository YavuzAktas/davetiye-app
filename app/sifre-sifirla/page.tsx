"use client";

import { useState } from "react";
import Link from "next/link";

export default function SifreSifirla() {
  const [email, setEmail]       = useState("");
  const [durum, setDurum]       = useState<"form" | "gonderildi">("form");
  const [yukleniyor, setYuk]    = useState(false);
  const [hata, setHata]         = useState("");

  async function gonder(e: React.FormEvent) {
    e.preventDefault();
    setHata("");
    setYuk(true);
    try {
      const res = await fetch("/api/auth/sifre-sifirla/gonder", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const veri = await res.json();
      if (!res.ok) { setHata(veri.hata); return; }
      setDurum("gonderildi");
    } catch {
      setHata("Bir hata oluştu, tekrar deneyin.");
    } finally {
      setYuk(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 bg-linear-to-br from-purple-600 to-pink-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Davetim</span>
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">

          {durum === "gonderildi" ? (
            <div className="text-center">
              <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">📬</div>
              <h1 className="text-xl font-bold text-gray-900 mb-2">E-posta gönderildi</h1>
              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                Eğer <strong>{email}</strong> adresiyle kayıtlı bir hesap varsa, şifre sıfırlama bağlantısı gönderildi. Spam klasörünü de kontrol edin.
              </p>
              <Link
                href="/giris"
                className="inline-flex items-center gap-2 text-sm text-purple-600 font-semibold hover:underline"
              >
                ← Giriş sayfasına dön
              </Link>
            </div>
          ) : (
            <>
              <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900 mb-1">Şifremi Unuttum</h1>
                <p className="text-sm text-gray-400">
                  E-posta adresinizi girin, sıfırlama bağlantısı gönderelim.
                </p>
              </div>

              <form onSubmit={gonder} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    E-posta Adresi
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    placeholder="ornek@mail.com"
                    required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
                  />
                </div>

                {hata && (
                  <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{hata}</p>
                )}

                <button
                  type="submit"
                  disabled={yukleniyor || !email}
                  className="w-full py-3 rounded-xl bg-linear-to-r from-purple-600 to-pink-600 text-white text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {yukleniyor ? "Gönderiliyor..." : "Sıfırlama Bağlantısı Gönder"}
                </button>
              </form>

              <p className="text-center text-sm text-gray-400 mt-5">
                <Link href="/giris" className="text-purple-600 font-semibold hover:underline">
                  ← Giriş sayfasına dön
                </Link>
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
