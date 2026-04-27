"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function NavLinks() {
  const { data: session } = useSession();
  const [profilAcik, setProfilAcik] = useState(false);
  const [mobMenuAcik, setMobMenuAcik] = useState(false);

  const anaLinkler = [
    { href: "/sablonlar", isim: "Şablonlar" },
    { href: "/fiyatlar", isim: "Fiyatlar" },
    ...(session ? [{ href: "/dashboard", isim: "Dashboard" }] : []),
  ];

  return (
    <>
      {/* ── Desktop Nav ── */}
      <div className="hidden md:flex items-center gap-1">
        {anaLinkler.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors"
          >
            {link.isim}
          </Link>
        ))}

        {session ? (
          <div className="relative ml-2">
            <button
              onClick={() => setProfilAcik(!profilAcik)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors"
            >
              {session.user?.image ? (
                <img src={session.user.image} alt="Profil" className="w-6 h-6 rounded-full" />
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

            {profilAcik && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-2xl shadow-xl py-1 z-50">
                <Link href="/dashboard" onClick={() => setProfilAcik(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Dashboard</Link>
                <Link href="/sablonlar" onClick={() => setProfilAcik(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Yeni Davetiye</Link>
                <Link href="/fiyatlar" onClick={() => setProfilAcik(false)} className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50">Planım</Link>
                <div className="border-t border-gray-100 mt-1 pt-1">
                  <button
                    onClick={() => { setProfilAcik(false); signOut({ callbackUrl: "/" }); }}
                    className="block w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50"
                  >
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-2">
            <Link href="/giris" className="text-sm text-gray-600 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-colors">
              Giriş Yap
            </Link>
            <Link href="/sablonlar" className="text-sm bg-purple-600 text-white px-4 py-2 rounded-xl hover:bg-purple-700 transition-colors font-medium">
              Başla
            </Link>
          </div>
        )}
      </div>

      {/* ── Mobile: CTA + Hamburger ── */}
      <div className="flex items-center gap-2 md:hidden">
        <Link
          href={session ? "/sablonlar" : "/giris"}
          className="text-xs bg-purple-600 text-white px-3 py-1.5 rounded-lg font-medium"
        >
          {session ? "+ Yeni" : "Başla"}
        </Link>
        <button
          onClick={() => setMobMenuAcik(!mobMenuAcik)}
          className="p-2 rounded-lg hover:bg-gray-50 transition-colors"
          aria-label="Menü"
        >
          {mobMenuAcik ? (
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile Dropdown ── */}
      {mobMenuAcik && (
        <div className="absolute top-full left-0 right-0 bg-white border-b border-gray-100 shadow-lg z-40 md:hidden">
          <div className="px-4 py-2">
            {anaLinkler.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobMenuAcik(false)}
                className="flex items-center py-3.5 text-gray-700 text-sm border-b border-gray-50 last:border-0"
              >
                {link.isim}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/sablonlar" onClick={() => setMobMenuAcik(false)} className="flex items-center py-3.5 text-purple-600 text-sm font-medium border-b border-gray-50">
                  + Yeni Davetiye
                </Link>
                <button
                  onClick={() => { setMobMenuAcik(false); signOut({ callbackUrl: "/" }); }}
                  className="flex items-center w-full py-3.5 text-red-500 text-sm"
                >
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link href="/giris" onClick={() => setMobMenuAcik(false)} className="flex items-center py-3.5 text-purple-600 text-sm font-medium">
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
