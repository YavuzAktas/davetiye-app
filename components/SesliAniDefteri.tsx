"use client";

import { useEffect, useState } from "react";

interface SesliAni {
  id: string;
  adSoyad: string;
  sure: number;
  createdAt: string;
  dosyaUrl: string;
}

export default function SesliAniDefteri({ slug }: { slug: string }) {
  const [anilar, setAnilar] = useState<SesliAni[]>([]);

  useEffect(() => {
    fetch(`/api/davetiye/${slug}/sesli-ani`)
      .then((r) => r.json())
      .then((data) => { if (Array.isArray(data)) setAnilar(data); })
      .catch(() => {});
  }, [slug]);

  return (
    <section className="my-12 px-4">
      <div className="max-w-md mx-auto">
        <h3 className="text-center font-serif text-2xl text-rose-800 mb-2">Sesli Anı Defteri</h3>
        <p className="text-center text-rose-500 text-sm mb-6">
          Misafirlerin bıraktığı sesli anılar
        </p>

        {anilar.length > 0 ? (
          <div className="flex flex-col gap-3">
            {anilar.map((ani) => (
              <div key={ani.id} className="bg-rose-50 rounded-xl p-3 flex items-center gap-3">
                <span className="text-2xl shrink-0">🎙️</span>
                <div className="flex-1 min-w-0">
                  <p className="text-rose-800 font-medium text-sm truncate">{ani.adSoyad}</p>
                  <audio src={ani.dosyaUrl} controls className="w-full mt-1" style={{ height: 32 }} />
                </div>
                <span className="text-rose-400 text-xs shrink-0">{ani.sure}s</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-rose-300 text-sm py-8">
            Henüz sesli anı yok — aşağıdaki butona dokun 🎙️
          </p>
        )}
      </div>
    </section>
  );
}
