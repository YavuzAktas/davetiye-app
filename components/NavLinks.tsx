"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useState } from "react";

interface Props { dark?: boolean }

export default function NavLinks({ dark = false }: Props) {
  const { data: session } = useSession();
  const [profilAcik, setProfilAcik] = useState(false);
  const [mobMenuAcik, setMobMenuAcik] = useState(false);

  const anaLinkler = [
    { href: "/sablonlar", isim: "Şablonlar" },
    { href: "/fiyatlar", isim: "Fiyatlar" },
    ...(session ? [{ href: "/dashboard", isim: "Dashboard" }] : []),
  ];

  const linkCls = dark
    ? "text-sm text-white/70 hover:text-white px-3 py-2 rounded-lg hover:bg-white/8 transition-all"
    : "text-sm text-gray-500 hover:text-gray-900 px-3 py-2 rounded-lg hover:bg-gray-50 transition-all";

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
              className={`flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-xl border transition-all ${
                dark
                  ? "border-white/15 hover:bg-white/8 hover:border-white/25"
                  : "border-gray-200 hover:bg-gray-50"
              }`}
            >
              {session.user?.image ? (
                <img src={session.user.image} alt="Profil" className="w-6 h-6 rounded-full" />
              ) : (
                <div className="w-6 h-6 bg-linear-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                  {session.user?.name?.[0] ?? "U"}
                </div>
              )}
              <span className={`text-sm max-w-24 truncate ${dark ? "text-white/80" : "text-gray-700"}`}>
                {session.user?.name?.split(" ")[0]}
              </span>
              <svg className={`w-3 h-3 ${dark ? "text-white/40" : "text-gray-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
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
          className={`p-2 rounded-lg transition-colors ${dark ? "hover:bg-white/10" : "hover:bg-gray-100"}`}>
          {mobMenuAcik ? (
            <svg className={`w-5 h-5 ${dark ? "text-white" : "text-gray-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className={`w-5 h-5 ${dark ? "text-white" : "text-gray-700"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
      </div>

      {/* ── Mobile dropdown ── */}
      {mobMenuAcik && (
        <div className="absolute top-full left-0 right-0 z-40 md:hidden bg-[#0d0118]/95 backdrop-blur-xl border-b border-white/8 shadow-2xl">
          <div className="px-5 py-4">
            {anaLinkler.map((link) => (
              <Link key={link.href} href={link.href} onClick={() => setMobMenuAcik(false)}
                className="flex items-center py-3.5 text-white/70 hover:text-white text-sm border-b border-white/5 last:border-0 transition-colors">
                {link.isim}
              </Link>
            ))}
            {session ? (
              <>
                <Link href="/sablonlar" onClick={() => setMobMenuAcik(false)}
                  className="flex items-center py-3.5 text-purple-400 text-sm font-medium border-b border-white/5">
                  + Yeni Davetiye
                </Link>
                <button onClick={() => { setMobMenuAcik(false); signOut({ callbackUrl: "/" }); }}
                  className="flex items-center w-full py-3.5 text-red-400 text-sm">
                  Çıkış Yap
                </button>
              </>
            ) : (
              <Link href="/giris" onClick={() => setMobMenuAcik(false)}
                className="flex items-center py-3.5 text-purple-400 text-sm font-medium">
                Giriş Yap
              </Link>
            )}
          </div>
        </div>
      )}
    </>
  );
}
