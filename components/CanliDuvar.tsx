"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

interface DuvarFoto {
  id: string;
  yukleyenAd: string;
  dosyaUrl: string;
  createdAt: string;
}

export default function CanliDuvar({ slug }: { slug: string }) {
  const [fotolar, setFotolar] = useState<DuvarFoto[]>([]);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fotolariYukle = useCallback(async () => {
    const res = await fetch(`/api/davetiye/${slug}/album`);
    if (res.ok) {
      const data = await res.json();
      if (Array.isArray(data)) setFotolar(data);
    }
  }, [slug]);

  useEffect(() => {
    fotolariYukle();
    pollRef.current = setInterval(fotolariYukle, 30_000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [fotolariYukle]);

  return (
    <section className="my-12 px-4">
      <div className="max-w-lg mx-auto">
        <h3 className="text-center font-serif text-2xl text-rose-800 mb-2">Canlı Fotoğraf Duvarı</h3>
        <p className="text-center text-rose-500 text-sm mb-6">
          Misafirlerin paylaştığı anlar — gerçek zamanlı
        </p>

        {fotolar.length > 0 ? (
          <div className="columns-2 sm:columns-3 gap-2 space-y-2">
            {fotolar.map((foto) => (
              <div key={foto.id} className="break-inside-avoid rounded-xl overflow-hidden relative group">
                <Image
                  src={foto.dosyaUrl}
                  alt={foto.yukleyenAd}
                  width={300}
                  height={300}
                  className="w-full object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 bg-linear-to-t from-black/60 to-transparent px-2 py-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                  <p className="text-white text-xs truncate">{foto.yukleyenAd}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-rose-300 text-sm py-8">
            Henüz fotoğraf yok — ilk fotoğrafı eklemek için aşağıdaki butona dokun 📸
          </p>
        )}
      </div>
    </section>
  );
}
