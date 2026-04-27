"use client";

import { useState, useEffect, useCallback } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";

interface Davetli {
  id: string;
  ad: string;
  telefon?: string;
  email?: string;
}

interface Davetiye {
  id: string;
  baslik: string;
  slug: string;
}

export default function DavetlilerSayfasi() {
  const params = useParams();
  const slug = params.slug as string;

  const [davetiye, setDavetiye] = useState<Davetiye | null>(null);
  const [davetliler, setDavetliler] = useState<Davetli[]>([]);
  const [yukleniyor, setYukleniyor] = useState(true);
  const [yeniAd, setYeniAd] = useState("");
  const [yeniTelefon, setYeniTelefon] = useState("");
  const [yeniEmail, setYeniEmail] = useState("");
  const [topluMetin, setTopluMetin] = useState("");
  const [aktifTab, setAktifTab] = useState<"liste" | "toplu" | "import">("liste");

  const davetlileriYukle = useCallback(async (davetiyeId: string) => {
    const res = await fetch(`/api/davetli?davetiyeId=${davetiyeId}`);
    const data = await res.json();
    setDavetliler(data.davetliler || []);
  }, []);

  useEffect(() => {
    const yukle = async () => {
      const res = await fetch(`/api/davetiye/${slug}`);
      const data = await res.json();
      setDavetiye(data.davetiye);
      if (data.davetiye) {
        await davetlileriYukle(data.davetiye.id);
      }
      setYukleniyor(false);
    };
    yukle();
  }, [slug, davetlileriYukle]);

  const davetliEkle = async () => {
    if (!yeniAd.trim() || !davetiye) return;
    await fetch("/api/davetli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        davetiyeId: davetiye.id,
        davetliler: [{ ad: yeniAd, telefon: yeniTelefon, email: yeniEmail }],
      }),
    });
    setYeniAd("");
    setYeniTelefon("");
    setYeniEmail("");
    await davetlileriYukle(davetiye.id);
  };

  const davetliSil = async (id: string) => {
    await fetch("/api/davetli", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (davetiye) await davetlileriYukle(davetiye.id);
  };

  const topluImport = async () => {
    if (!topluMetin.trim() || !davetiye) return;
    const satirlar = topluMetin.trim().split("\n");
    const davetlilerListesi = satirlar
      .map((satir) => {
        const parcalar = satir.split(",").map((p) => p.trim());
        return {
          ad: parcalar[0] || "",
          telefon: parcalar[1] || "",
          email: parcalar[2] || "",
        };
      })
      .filter((d) => d.ad);

    await fetch("/api/davetli", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ davetiyeId: davetiye.id, davetliler: davetlilerListesi }),
    });
    setTopluMetin("");
    await davetlileriYukle(davetiye.id);
    setAktifTab("liste");
  };

  const whatsappMesajOlustur = () => {
    if (!davetiye) return "";
    const link = `${process.env.NEXT_PUBLIC_URL}/davetiye/${davetiye.slug}`;
    return encodeURIComponent(
      `Sayın misafirimiz,\n\n${davetiye.baslik} etkinliğimize davetlisiniz.\n\nDavetiyeniz için: ${link}`
    );
  };

  if (yukleniyor) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-6">
        <Link href={`/dashboard/davetiye/${slug}`} className="text-sm text-gray-400 hover:text-gray-600">
          Geri
        </Link>
        <span className="text-gray-300">/</span>
        <h1 className="text-xl font-bold text-gray-900">Davetli Listesi</h1>
      </div>

      {davetiye && (
        <p className="text-gray-500 text-sm mb-6">{davetiye.baslik}</p>
      )}

      {/* Tab */}
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-6">
        {[
          { id: "liste", isim: `Liste (${davetliler.length})` },
          { id: "toplu", isim: "Toplu Paylaş" },
          { id: "import", isim: "İçe Aktar" },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setAktifTab(tab.id as "liste" | "toplu" | "import")}
            className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors ${
              aktifTab === tab.id
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.isim}
          </button>
        ))}
      </div>

      {/* Liste Tabı */}
      {aktifTab === "liste" && (
        <div>
          {/* Yeni Davetli Ekle */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-5">
            <p className="font-medium text-gray-800 mb-4 text-sm">Davetli Ekle</p>
            <div className="grid grid-cols-3 gap-3 mb-3">
              <input
                type="text"
                placeholder="Ad Soyad *"
                value={yeniAd}
                onChange={(e) => setYeniAd(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="tel"
                placeholder="Telefon"
                value={yeniTelefon}
                onChange={(e) => setYeniTelefon(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <input
                type="email"
                placeholder="E-posta"
                value={yeniEmail}
                onChange={(e) => setYeniEmail(e.target.value)}
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>
            <button
              onClick={davetliEkle}
              className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
            >
              Ekle
            </button>
          </div>

          {/* Davetli Listesi */}
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
            {davetliler.length === 0 ? (
              <div className="text-center py-12 text-gray-400 text-sm">
                Henüz davetli eklenmedi
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {davetliler.map((davetli) => (
                  <div key={davetli.id} className="flex items-center justify-between px-5 py-3.5">
                    <div>
                      <p className="font-medium text-gray-800 text-sm">{davetli.ad}</p>
                      <div className="flex gap-3 mt-0.5">
                        {davetli.telefon && (
                          <p className="text-xs text-gray-400">{davetli.telefon}</p>
                        )}
                        {davetli.email && (
                          <p className="text-xs text-gray-400">{davetli.email}</p>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => davetliSil(davetli.id)}
                      className="text-xs text-red-400 hover:text-red-600 transition-colors px-2 py-1"
                    >
                      Sil
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toplu Paylaş Tabı */}
      {aktifTab === "toplu" && (
        <div className="space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <p className="font-medium text-gray-800 mb-2 text-sm">WhatsApp Toplu Mesaj</p>
            <p className="text-xs text-gray-400 mb-4">
              Her davetli için ayrı WhatsApp linki oluşturulur. Telefon numarası olan davetlilere gönderebilirsiniz.
            </p>
            <div className="space-y-3">
              {davetliler.filter((d) => d.telefon).map((davetli) => (
                <div key={davetli.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
  <div>
    <p className="text-sm font-medium text-gray-800">{davetli.ad}</p>
    <p className="text-xs text-gray-400">{davetli.telefon}</p>
  </div>
  
  {/* DÜZELTİLEN KISIM: <a etiketi eklendi */}
  <a
    href={`https://wa.me/${davetli.telefon?.replace(/\D/g, "")}?text=${whatsappMesajOlustur()}`}
    target="_blank"
    rel="noopener noreferrer"
    className="bg-green-500 text-white text-xs px-3 py-1.5 rounded-lg hover:bg-green-600 transition-colors"
  >
    WhatsApp
  </a>
</div>
              ))}
              {davetliler.filter((d) => d.telefon).length === 0 && (
                <p className="text-center text-sm text-gray-400 py-6">
                  Telefon numarası olan davetli yok. Davetli listesine telefon ekleyin.
                </p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* İçe Aktar Tabı */}
      {aktifTab === "import" && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <p className="font-medium text-gray-800 mb-2 text-sm">Toplu İçe Aktar</p>
          <p className="text-xs text-gray-400 mb-4">
            Her satıra bir davetli yazın. Format: <span className="font-mono bg-gray-100 px-1 rounded">Ad Soyad, Telefon, Email</span>
          </p>
          <textarea
            rows={8}
            placeholder={`Ahmet Yılmaz, 05001234567, ahmet@mail.com\nAyşe Kaya, 05009876543\nMehmet Demir`}
            value={topluMetin}
            onChange={(e) => setTopluMetin(e.target.value)}
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none mb-3"
          />
          <button
            onClick={topluImport}
            className="bg-purple-600 text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:bg-purple-700 transition-colors"
          >
            İçe Aktar
          </button>
        </div>
      )}
    </div>
  );
}