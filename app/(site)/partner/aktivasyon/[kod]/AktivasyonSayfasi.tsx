"use client";

import { useEffect, useState } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

type Durum = "bekliyor" | "isleniyor" | "yonlendiriliyor" | "hata";

export default function AktivasyonSayfasi({
  kod,
  firmaAdi,
}: {
  kod: string;
  firmaAdi: string;
}) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [durum, setDurum] = useState<Durum>("bekliyor");
  const [hataMesaji, setHataMesaji] = useState("");

  useEffect(() => {
    if (status === "loading" || status === "unauthenticated") return;
    setDurum("isleniyor");

    fetch(`/api/partner/aktivasyon/${kod}/baglanti`, { method: "POST" })
      .then(async res => {
        if (res.ok) {
          setDurum("yonlendiriliyor");
          router.push(`/sablonlar?aktivasyon=${kod}`);
        } else {
          const d = await res.json().catch(() => ({}));
          setHataMesaji(d.error ?? "Aktivasyon tamamlanamadı.");
          setDurum("hata");
        }
      })
      .catch(() => {
        setHataMesaji("Sunucuya bağlanılamadı, tekrar deneyin.");
        setDurum("hata");
      });
  }, [status, session?.user?.id, kod, router]);

  /* Giriş yapılmamış */
  if (status === "unauthenticated") {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-purple-100 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">🎁</div>
        <p className="text-xs font-semibold text-purple-600 tracking-widest uppercase mb-2">{firmaAdi} — Özel Davetiye Hakkı</p>
        <h1 className="text-2xl font-black text-gray-900 mb-3">Ücretsiz Dijital Davetiye</h1>
        <p className="text-sm text-gray-500 max-w-sm mx-auto mb-8 leading-relaxed">
          Bu link sayesinde dijital davetiyenizi <strong>ücretsiz</strong> oluşturabilirsiniz.
          Devam etmek için bir hesap oluşturun veya giriş yapın.
        </p>
        <button
          onClick={() => signIn(undefined, { callbackUrl: `/partner/aktivasyon/${kod}` })}
          className="bg-linear-to-r from-purple-600 to-pink-600 text-white font-bold px-8 py-3.5 rounded-2xl hover:opacity-90 transition-opacity text-sm"
        >
          Hesap Oluştur / Giriş Yap →
        </button>
        <p className="text-[11px] text-gray-400 mt-5 leading-relaxed max-w-xs mx-auto">
          Kayıt olarak{" "}
          <a href="/kullanim-sartlari" className="text-purple-500 hover:underline">Kullanım Şartları</a>
          {" "}ve{" "}
          <a href="/gizlilik" className="text-purple-500 hover:underline">Gizlilik Politikası</a>
          'nı kabul etmiş olursunuz.
        </p>
      </div>
    );
  }

  /* Hata */
  if (durum === "hata") {
    return (
      <div className="text-center">
        <div className="w-20 h-20 bg-red-50 rounded-3xl flex items-center justify-center text-4xl mx-auto mb-6">⛔</div>
        <h1 className="text-2xl font-black text-gray-900 mb-2">Bu Link Kullanılamaz</h1>
        <p className="text-sm text-gray-500 mb-2">{hataMesaji}</p>
        <p className="text-xs text-gray-400">
          Yardım için{" "}
          <a href="mailto:destek@bekleriz.com" className="text-purple-600 hover:underline">destek@bekleriz.com</a>
        </p>
      </div>
    );
  }

  /* Yükleniyor / yönlendiriliyor */
  return (
    <div className="text-center">
      <div className="w-16 h-16 rounded-full border-4 border-purple-200 border-t-purple-600 animate-spin mx-auto mb-6" />
      <p className="text-sm font-semibold text-gray-600">
        {durum === "yonlendiriliyor" ? "Yönlendiriliyor…" : "Aktivasyon kodu doğrulanıyor…"}
      </p>
    </div>
  );
}
