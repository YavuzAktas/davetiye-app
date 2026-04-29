"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense } from "react";

function KvkkOnayIcerigi() {
  const { update }    = useSession();
  const searchParams  = useSearchParams();
  const router        = useRouter();
  const callbackUrl   = searchParams.get("callbackUrl") || "/dashboard";

  const [kvkk,      setKvkk]      = useState(false);
  const [kullanim,  setKullanim]  = useState(false);
  const [yukleniyor, setYuk]      = useState(false);
  const [hata,      setHata]      = useState("");

  async function onayla(e: React.FormEvent) {
    e.preventDefault();
    if (!kvkk)     { setHata("KVKK Aydınlatma Metnini onaylamanız gerekiyor."); return; }
    if (!kullanim) { setHata("Kullanım Şartlarını kabul etmeniz gerekiyor."); return; }
    setHata("");
    setYuk(true);
    try {
      const res = await fetch("/api/auth/kvkk-onay", { method: "POST" });
      if (!res.ok) { setHata("Bir hata oluştu, tekrar deneyin."); return; }
      await update();
      router.replace(callbackUrl);
    } catch {
      setHata("Bir hata oluştu, tekrar deneyin.");
    } finally {
      setYuk(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
      <div className="w-14 h-14 bg-purple-50 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-5">🔐</div>
      <h1 className="text-xl font-bold text-gray-900 text-center mb-1">Gizlilik Onayı Gerekli</h1>
      <p className="text-sm text-gray-500 text-center mb-6 leading-relaxed">
        Platformumuzu kullanmadan önce kişisel veri işleme politikamızı onaylamanız gerekmektedir.
      </p>

      {/* Özet bilgi kutusu */}
      <div className="bg-gray-50 rounded-2xl p-4 mb-6 space-y-2 text-xs text-gray-600 leading-relaxed">
        <p><strong className="text-gray-800">Hangi veriler işleniyor?</strong><br/>
          Adınız, e-posta adresiniz ve oluşturduğunuz davetiye içerikleri.</p>
        <p><strong className="text-gray-800">Neden işleniyor?</strong><br/>
          Hizmetin sunulması, RSVP takibi ve iletişim amacıyla (KVKK m.5/2-c).</p>
        <p><strong className="text-gray-800">Ne kadar süre saklanıyor?</strong><br/>
          Hesap silinene kadar; etkinlik tarihinden 1 yıl sonra RSVP verileri otomatik silinir.</p>
        <p>
          Tüm ayrıntılar için{" "}
          <Link href="/kvkk" target="_blank" className="text-purple-600 font-semibold hover:underline">
            KVKK Aydınlatma Metni
          </Link>
          {'ni inceleyebilirsiniz.'}
        </p>
      </div>

      <form onSubmit={onayla} className="space-y-4">
        {/* KVKK checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 shrink-0">
            <input type="checkbox" checked={kvkk} onChange={e => setKvkk(e.target.checked)} className="sr-only"/>
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              kvkk ? "bg-purple-600 border-purple-600" : "border-gray-300 group-hover:border-purple-400"
            }`}>
              {kvkk && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>}
            </div>
          </div>
          <span className="text-xs text-gray-600 leading-relaxed">
            <Link href="/kvkk" target="_blank" className="text-purple-600 font-semibold hover:underline">
              KVKK Aydınlatma Metni
            </Link>
            {"'ni okudum; kişisel verilerimin açıklanan amaçlarla işlenmesine "}
            <span className="font-semibold text-gray-800">açıkça onay veriyorum.</span>
            {" (Zorunlu)"}
          </span>
        </label>

        {/* Kullanım Şartları checkbox */}
        <label className="flex items-start gap-3 cursor-pointer group">
          <div className="relative mt-0.5 shrink-0">
            <input type="checkbox" checked={kullanim} onChange={e => setKullanim(e.target.checked)} className="sr-only"/>
            <div className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${
              kullanim ? "bg-purple-600 border-purple-600" : "border-gray-300 group-hover:border-purple-400"
            }`}>
              {kullanim && <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 10 10">
                <path d="M1.5 5L4 7.5L8.5 2.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>}
            </div>
          </div>
          <span className="text-xs text-gray-600 leading-relaxed">
            <Link href="/kullanim-sartlari" target="_blank" className="text-purple-500 hover:underline">
              Kullanım Şartları
            </Link>
            {" ve "}
            <Link href="/gizlilik" target="_blank" className="text-purple-500 hover:underline">
              Gizlilik Politikası
            </Link>
            {"'nı okudum ve kabul ediyorum. (Zorunlu)"}
          </span>
        </label>

        {hata && (
          <p className="text-sm text-red-500 bg-red-50 px-4 py-2 rounded-xl">{hata}</p>
        )}

        <button
          type="submit"
          disabled={yukleniyor || !kvkk || !kullanim}
          className="w-full py-3 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{ background: "linear-gradient(135deg,#7C3AED,#EC4899)" }}
        >
          {yukleniyor ? "Kaydediliyor..." : "Onaylıyorum, Devam Et"}
        </button>
      </form>

      <p className="text-[10px] text-gray-400 text-center mt-4 leading-relaxed">
        Onay tarihiniz kayıt altına alınır. İstediğiniz zaman hesabınızı silebilir ve verilerinizi talep edebilirsiniz.
      </p>
    </div>
  );
}

export default function KvkkOnayPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: "linear-gradient(135deg,#7C3AED,#DB2777)" }}>
              <span className="text-white font-bold">D</span>
            </div>
            <span className="text-xl font-bold text-gray-900">Davetim</span>
          </Link>
        </div>
        <Suspense fallback={<div className="text-center text-gray-400 text-sm">Yükleniyor...</div>}>
          <KvkkOnayIcerigi />
        </Suspense>
      </div>
    </div>
  );
}
