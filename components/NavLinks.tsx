"use client";

import Link from "next/link";
import Image from "next/image";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

export default function NavLinks() {
  const { data: session } = useSession();
  const [profilAcik, setProfilAcik] = useState(false);
  const [mobMenuAcik, setMobMenuAcik] = useState(false);

  const anaLinkler = [
    { href: "/sablonlar", isim: "Şablonlar" },
    { href: "/fiyatlar",  isim: "Fiyatlar"  },
    { href: "/blog",      isim: "Blog"       },
    ...(session ? [{ href: "/dashboard", isim: "Dashboard" }] : []),
  ];

  const linkCls = "text-sm text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all";

  return (
    <>
      {/* ── Desktop ── */}
      <div className="hidden md:flex items-center gap-1">
        {anaLinkler.map((link) => (
          <Link key={link.href} href={link.href} className={linkCls}>
            {link.isim}
          </Link>
        ))}

        {session ? (
          <div className="relative ml-3">
            <button
              onClick={() => setProfilAcik(!profilAcik)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border border-gray-200 hover:bg-gray-50 transition-all"
            >
              {session.user?.image ? (
                <Image src={session.user.image} alt="Profil" width={24} height={24} className="rounded-full" />
              ) : (
                <div className="w-6 h-6 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
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
              <div className="absolute right-0 mt-2 w-52 bg-white border border-gray-100 rounded-2xl shadow-2xl shadow-black/10 py-2 z-50 overflow-hidden">
                <div className="px-4 py-2 border-b border-gray-50 mb-1">
                  <p className="text-xs text-gray-400 truncate">{session.user?.email}</p>
                </div>
                {[
                  { href: "/dashboard", label: "Dashboard" },
                  { href: "/sablonlar", label: "Yeni Davetiye" },
                  { href: "/fiyatlar", label: "Planım" },
                  { href: "/dashboard/ayarlar", label: "Ayarlar" },
                ].map(({ href, label }) => (
                  <Link key={href} href={href} onClick={() => setProfilAcik(false)}
                    className="flex items-center px-4 py-2.5 text-sm text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-colors">
                    {label}
                  </Link>
                ))}
                <div className="border-t border-gray-50 mt-1 pt-1">
                  <button onClick={() => { setProfilAcik(false); signOut({ callbackUrl: "/" }); }}
                    className="flex items-center w-full px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition-colors">
                    Çıkış Yap
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2 ml-3">
            <Link href="/giris" className={linkCls}>Giriş Yap</Link>
            <Link href="/sablonlar"
              className="text-sm bg-linear-to-r from-purple-600 to-pink-600 text-white px-4 py-2 rounded-xl font-medium hover:opacity-90 hover:shadow-lg hover:shadow-purple-500/25 transition-all">
              Başla
            </Link>
          </div>
        )}
      </div>

      {/* ── Mobile trigger ── */}
      <div className="flex items-center gap-2 md:hidden">
        <Link href={session ? "/sablonlar" : "/giris"}
          className="text-xs bg-linear-to-r from-purple-600 to-pink-600 text-white px-3.5 py-1.5 rounded-lg font-medium">
          {session ? "+ Yeni" : "Başla"}
        </Link>
        <button onClick={() => setMobMenuAcik(!mobMenuAcik)} aria-label="Menü"
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
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

      {/* ── Mobile dropdown ── */}
      {mobMenuAcik && (
        <div className="absolute top-full left-0 right-0 z-40 md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-100 shadow-lg">
          <div className="px-5 py-3">
            {anaLinkler.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobMenuAcik(false)}
                className="flex items-center py-3.5 text-gray-600 hover:text-gray-900 text-sm border-b border-gray-50 last:border-0 transition-colors">
                {link.isim}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/sablonlar" onClick={() => setMobMenuAcik(false)}
                  className="flex items-center py-3.5 text-purple-600 text-sm font-medium border-b border-gray-50">
                  + Yeni Davetiye
                </Link>
                <button onClick={() => { setMobMenuAcik(false); signOut({ callbackUrl: "/" }); }}
                  className="flex items-center w-full py-3.5 text-red-500 text-sm">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link href="/giris" onClick={() => setMobMenuAcik(false)}
                className="flex items-center py-3.5 text-purple-600 text-sm font-medium">
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
