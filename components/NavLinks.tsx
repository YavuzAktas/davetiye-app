"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export default function NavLinks() {
  const { data: session } = useSession();

  return (
    <div className="flex items-center gap-6">
      <Link
        href="/sablonlar"
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Şablonlar
      </Link>
      <Link
        href="/fiyatlar"
        className="text-sm text-gray-600 hover:text-gray-900"
      >
        Fiyatlar
      </Link>
      {session ? (
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="text-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Çıkış
          </button>
        </div>
      ) : (
        <Link
          href="/giris"
          className="text-sm bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
        >
          Giriş Yap
        </Link>
      )}
    </div>
  );
}