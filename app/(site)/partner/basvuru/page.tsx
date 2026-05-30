"use client";

import { useState } from "react";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import type { Metadata } from "next";

const FIRMA_TURLERI = [
  "Düğün organizasyon firması",
  "Düğün fotoğrafçısı",
  "Etkinlik organizatörü",
  "Çiçekçi & dekorasyon firması",
  "Catering & mekan işletmesi",
  "Müzik grubu & DJ",
  "Diğer",
];

const MUSTERI_SAYILARI = ["1-5 müşteri/ay", "5-15 müşteri/ay", "15-30 müşteri/ay", "30+ müşteri/ay"];

type Durum = "form" | "gonderiliyor" | "basarili" | "zatenVar" | "hata";

export default function PartnerBasvuruPage() {
  const { data: session, status } = useSession();
  const [durum, setDurum] = useState<Durum>("form");
  const [hata, setHata] = useState("");
  const [form, setForm] = useState({
    firmaAdi: "",
    telefon: "",
    firmaTuru: "",
    aylikMusteriSayisi: "",
    basvuruNotu: "",
  });

  const degistir = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));

  const gonder = async (e: React.FormEvent) => {
    e.preventDefault();
    setDurum("gonderiliyor");
    setHata("");
    try {
      const res = await fetch("/api/partner/basvuru", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.status === 409) { setDurum("zatenVar"); return; }
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        setHata(d.error ?? "Bir hata oluştu.");
        setDurum("hata");
        return;
      }
      setDurum("basarili");
    } catch {
      setHata("Sunucuya bağlanılamadı.");
      setDurum("hata");
    }
  };

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 rounded-full border-2 border-purple-600 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-purple-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">🤝</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Partner Başvurusu</h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Başvuru yapmak için önce Bekleriz hesabınıza giriş yapmanız gerekiyor.
          </p>
          <button
            onClick={() => signIn(undefined, { callbackUrl: "/partner/basvuru" })}
            className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold py-3 rounded-2xl hover:opacity-90 transition-opacity text-sm"
          >
            Giriş Yap / Hesap Oluştur
          </button>
          <Link href="/partner" className="block mt-4 text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Partner Programına Dön
          </Link>
        </div>
      </div>
    );
  }

  if (durum === "basarili") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">✅</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Başvurunuz Alındı!</h1>
          <p className="text-sm text-gray-500 mb-2 leading-relaxed">
            24 saat içinde {session?.user?.email} adresine dönüş yapacağız.
          </p>
          <p className="text-xs text-gray-400 mb-8">Onay sonrası partner paneliniz aktive edilecektir.</p>
          <Link
            href="/"
            className="inline-block bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3 rounded-2xl hover:opacity-90 transition-opacity text-sm"
          >
            Ana Sayfaya Dön
          </Link>
        </div>
      </div>
    );
  }

  if (durum === "zatenVar") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-yellow-50 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6">⏳</div>
          <h1 className="text-2xl font-black text-gray-900 mb-2">Başvurunuz İnceleniyor</h1>
          <p className="text-sm text-gray-500 mb-8 leading-relaxed">
            Bu hesap için daha önce bir başvuru yapılmış. Ekibimiz en kısa sürede sizinle iletişime geçecek.
          </p>
          <Link href="/partner" className="text-sm text-purple-600 hover:underline">
            ← Partner Programına Dön
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4">
      <div className="max-w-lg mx-auto">

        <div className="mb-8">
          <Link href="/partner" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
            ← Partner Programı
          </Link>
          <h1 className="text-3xl font-black text-gray-900 mt-4 mb-1">Partner Başvurusu</h1>
          <p className="text-sm text-gray-500">Başvurunuzu alır, 24 saat içinde iletişime geçeriz.</p>
        </div>

        <form onSubmit={gonder} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 space-y-5">

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">Ad Soyad</label>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-400">
              {session?.user?.name ?? session?.user?.email}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">E-posta</label>
            <div className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-400 font-mono">
              {session?.user?.email}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Firma / Organizasyon Adı <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="firmaAdi"
              value={form.firmaAdi}
              onChange={degistir}
              required
              placeholder="örn. Yıldız Organizasyon"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Telefon <span className="text-red-400">*</span>
            </label>
            <input
              type="tel"
              name="telefon"
              value={form.telefon}
              onChange={degistir}
              required
              placeholder="05XX XXX XX XX"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Firma Türü <span className="text-red-400">*</span>
            </label>
            <select
              name="firmaTuru"
              value={form.firmaTuru}
              onChange={degistir}
              required
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
            >
              <option value="">Seçin…</option>
              {FIRMA_TURLERI.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Aylık Tahmini Müşteri Sayısı <span className="text-red-400">*</span>
            </label>
            <select
              name="aylikMusteriSayisi"
              value={form.aylikMusteriSayisi}
              onChange={degistir}
              required
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all bg-white"
            >
              <option value="">Seçin…</option>
              {MUSTERI_SAYILARI.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1.5">
              Ek Not <span className="text-gray-300">(isteğe bağlı)</span>
            </label>
            <textarea
              name="basvuruNotu"
              value={form.basvuruNotu}
              onChange={degistir}
              rows={3}
              placeholder="Bizimle paylaşmak istediğiniz ek bilgiler…"
              className="w-full border border-gray-200 rounded-2xl px-4 py-3 text-sm outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-100 transition-all resize-none"
            />
          </div>

          {durum === "hata" && (
            <p className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-xl px-4 py-3">{hata}</p>
          )}

          <button
            type="submit"
            disabled={durum === "gonderiliyor"}
            className="w-full bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold py-3.5 rounded-2xl hover:opacity-90 transition-opacity text-sm disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {durum === "gonderiliyor" ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                Gönderiliyor…
              </>
            ) : "Başvuruyu Gönder →"}
          </button>

          <p className="text-center text-[11px] text-gray-400 leading-relaxed">
            Başvurunuzu göndererek{" "}
            <Link href="/partner/sozlesme" className="text-purple-600 hover:underline">Partner Sözleşmesi</Link>
            {" "}ve{" "}
            <Link href="/kullanim-sartlari" className="text-purple-600 hover:underline">Kullanım Şartları</Link>
            'nı okuduğunuzu kabul etmiş olursunuz.
          </p>
        </form>
      </div>
    </div>
  );
}
