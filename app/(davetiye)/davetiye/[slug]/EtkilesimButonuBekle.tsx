"use client";

import { useState, useEffect } from "react";
import EtkilesimButonu from "@/components/EtkilesimButonu";

interface Props {
  slug: string;
  renk?: string;
  albumAktif: boolean;
  aniDefteriAktif: boolean;
  canliDuvarAktif: boolean;
  sesliAniAktif: boolean;
}

export default function EtkilesimButonuBekle(props: Props) {
  const [gorunur, setGorunur] = useState(false);

  useEffect(() => {
    const handler = () => setGorunur(true);
    document.addEventListener("davetiye-acildi", handler);
    return () => document.removeEventListener("davetiye-acildi", handler);
  }, []);

  if (!gorunur) return null;
  return <EtkilesimButonu {...props} />;
}
