"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";

export default function YeniDavetiyeToast() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const pathname     = usePathname();
  const [gorünür, setGorünür] = useState(false);

  useEffect(() => {
    if (searchParams.get("yeni") === "1") {
      setGorünür(true);
      // URL'den ?yeni=1 parametresini temizle
      router.replace(pathname, { scroll: false });
      const t = setTimeout(() => setGorünür(false), 4000);
      return () => clearTimeout(t);
    }
  }, [searchParams, router, pathname]);

  if (!gorünür) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-[fadeSlideUp_0.35s_ease]">
      <div className="flex items-center gap-3 bg-white border border-green-200 shadow-lg rounded-2xl px-5 py-3.5">
        <span className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center shrink-0">
          <svg className="w-4 h-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </span>
        <p className="text-sm font-semibold text-gray-800">Davetiyeniz başarıyla oluşturuldu!</p>
        <button onClick={() => setGorünür(false)} className="ml-1 text-gray-300 hover:text-gray-500 transition-colors text-lg leading-none">×</button>
      </div>
    </div>
  );
}
