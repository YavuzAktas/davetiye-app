"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";

export default function ReferralKaydetici() {
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status !== "authenticated" || !session?.user?.id) return;

    let refKod = "";
    try { refKod = localStorage.getItem("bekleriz_ref") ?? ""; } catch {}
    if (!refKod) {
      const m = document.cookie.match(/bekleriz_ref=([^;]+)/);
      if (m) refKod = decodeURIComponent(m[1]);
    }
    if (!refKod) return;

    fetch("/api/referral/kaydet", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refKod }),
    })
      .then(r => r.json())
      .then(d => {
        if (d.ok) {
          try { localStorage.removeItem("bekleriz_ref"); } catch {}
          document.cookie = "bekleriz_ref=; max-age=0; path=/";
        }
      })
      .catch(() => {});
  }, [status, session?.user?.id]);

  return null;
}
