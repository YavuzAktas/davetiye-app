"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ReferralYonlendirme() {
  const params = useParams();
  const router = useRouter();
  const kod = params.kod as string;

  useEffect(() => {
    if (!kod) { router.replace("/sablonlar"); return; }
    try {
      localStorage.setItem("davetrota_ref", kod);
      document.cookie = `davetrota_ref=${encodeURIComponent(kod)}; max-age=2592000; path=/; samesite=lax`;
    } catch {}
    router.replace("/sablonlar");
  }, [kod, router]);

  return (
    <div className="min-h-screen bg-[#080112] flex items-center justify-center">
      <div className="flex items-center gap-3 text-white/30">
        <span className="w-5 h-5 border-2 border-white/20 border-t-purple-400 rounded-full animate-spin" />
        <span className="text-sm">Yönlendiriliyor...</span>
      </div>
    </div>
  );
}
