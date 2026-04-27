"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function NavLinks() {
  const { data: session } = useSession();
  const [menuAcik, setMenuAcik] = useState(false);

  return (
    <div className="flex items-center gap-1">
      <Link
        href="/sablonlar"
        className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Şablonlar
      </Link>
      <Link
        href="/fiyatlar"
        className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
      >
        Fiyatlar
      </Link>

      {session ? (
        <div className="flex items-center gap-2 ml-2">
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Dashboard
          </Link>
          <div className="relative">
            <button
              onClick={() => setMenuAcik(!menuAcik)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {session.user?.image ? (
                <img
                  src={session.user.image}
                  alt="Profil"
                  className="w-6 h-6 rounded-full"
                />
              ) : (
                <div className="w-6 h-6 bg-purple-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {session.user?.name?.[0] ?? "U"}
                </div>
              )}
              <span className="text-sm text-gray-700 max-w-24 truncate">
                {session.user?.name?.split(" ")[0]}
              </span>
              <svg className="w-3 h-3 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {menuAcik && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-1 z-50">
                <Link
                  href="/dashboard"
                  onClick={() => setMenuAcik(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Dashboard
                </Link>
                <Link
                  href="/sablonlar"
                  onClick={() => setMenuAcik(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Yeni Davetiye
                </Link>
                <Link
                  href="/fiyatlar"
                  onClick={() => setMenuAcik(false)}
                  className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                >
                  Planım
                </Link>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => {
                      setMenuAcik(false);
                      signOut({ callbackUrl: "/" });
                    }}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-2 ml-2">
          <Link
            href="/giris"
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Giriş Yap
          </Link>
          <Link
            href="/sablonlar"
            className="text-sm bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors font-medium"
          >
            Başla
          </Link>
        </div>
      )}
    </div>
  );
}