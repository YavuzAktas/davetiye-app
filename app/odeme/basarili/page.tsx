"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function BasariliIcerigi() {
  const searchParams = useSearchParams();
  const plan = searchParams.get("plan");

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="text-6xl mb-6">🎉</div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Ödeme Başarılı!
        </h1>
        <p className="text-gray-500 mb-8">
          {plan === "standart" ? "Standart" : "Premium"} plana geçiş yaptınız.
        </p>
        <Link
          href="/dashboard"
          className="bg-purple-600 text-white px-8 py-3 rounded-xl font-medium hover:bg-purple-700 transition-colors"
        >
          Dashboard&apos;a Git
        </Link>
      </div>
    </div>
  );
}

export default function OdemeBasarili() {
  return (
    <Suspense>
      <BasariliIcerigi />
    </Suspense>
  );
}
