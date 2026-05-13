"use client";

import { useEffect } from "react";

const GORUNTULENME_PENCERE_MS = 6 * 60 * 60 * 1000;

export default function DavetiyeGoruntulenmeKaydedici({ slug }: { slug: string }) {
  useEffect(() => {
    const storageKey = `davetiye-goruntulenme:${slug}`;
    const simdi = Date.now();
    const oncekiKayit = Number(window.localStorage.getItem(storageKey) ?? "0");

    if (Number.isFinite(oncekiKayit) && simdi - oncekiKayit < GORUNTULENME_PENCERE_MS) {
      return;
    }

    try {
      window.localStorage.setItem(storageKey, String(simdi));
    } catch {
      return;
    }

    const endpoint = `/api/davetiye/${encodeURIComponent(slug)}/goruntulenme`;
    if (navigator.sendBeacon) {
      navigator.sendBeacon(endpoint);
      return;
    }

    fetch(endpoint, {
      method: "POST",
      keepalive: true,
      credentials: "same-origin",
    }).catch(() => {
      try {
        window.localStorage.removeItem(storageKey);
      } catch {
        return;
      }
    });
  }, [slug]);

  return null;
}
