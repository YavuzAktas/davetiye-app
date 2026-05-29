"use client";

import { useTransition } from "react";
import { upsellOzellikEkle } from "@/app/(site)/odeme/[slug]/actions";
import { tutarMetni } from "@/lib/davetiye-fiyatlandirma";

export type UpsellOzellik = {
  kod: string;
  icon: string;
  ad: string;
  desc: string;
  tutar: number;
};

interface Props {
  davetiyeId: string;
  ozellikler: UpsellOzellik[];
}

export default function OdemeUpsell({ davetiyeId, ozellikler }: Props) {
  const [isPending, startTransition] = useTransition();

  if (ozellikler.length === 0) return null;

  const ekle = (kod: string) => {
    startTransition(async () => {
      await upsellOzellikEkle(davetiyeId, kod);
    });
  };

  return (
    <div style={{
      margin: "16px 0",
      padding: "18px 20px",
      borderRadius: 18,
      background: "rgba(245,158,11,0.05)",
      border: "1px solid rgba(245,158,11,0.22)",
    }}>
      {/* Başlık */}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
        <span style={{ fontSize: 13 }}>✨</span>
        <p style={{
          fontSize: 11, fontWeight: 700, letterSpacing: "0.15em",
          textTransform: "uppercase", color: "#d97706", margin: 0,
        }}>
          Davetiyenize Ekleyin
        </p>
      </div>

      {/* Özellik listesi */}
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {ozellikler.map(o => (
          <div key={o.kod} style={{
            display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
            padding: "10px 12px", borderRadius: 12,
            background: "#fafafa",
            border: "1px solid #f0f0f0",
            opacity: isPending ? 0.6 : 1,
            transition: "opacity 0.2s",
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
              <span style={{ fontSize: 18, flexShrink: 0 }}>{o.icon}</span>
              <div style={{ minWidth: 0 }}>
                <p style={{
                  fontSize: 13, fontWeight: 600, color: "#374151",
                  margin: 0, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
                }}>
                  {o.ad}
                </p>
                <p style={{ fontSize: 11, color: "#9ca3af", margin: "2px 0 0" }}>
                  {o.desc}
                </p>
              </div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
              <span style={{ fontSize: 12, fontWeight: 700, color: "#7c3aed" }}>
                +{tutarMetni(o.tutar)}
              </span>
              <button
                type="button"
                disabled={isPending}
                onClick={() => ekle(o.kod)}
                style={{
                  padding: "5px 14px", borderRadius: 8, cursor: isPending ? "not-allowed" : "pointer",
                  fontSize: 12, fontWeight: 700,
                  background: "rgba(124,58,237,0.09)",
                  border: "1px solid rgba(124,58,237,0.3)",
                  color: "#7c3aed",
                  transition: "all 0.15s",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={e => {
                  if (!isPending) {
                    (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.18)";
                    (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,58,237,0.5)";
                  }
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLButtonElement).style.background = "rgba(124,58,237,0.09)";
                  (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(124,58,237,0.3)";
                }}
              >
                {isPending ? "…" : "Ekle"}
              </button>
            </div>
          </div>
        ))}
      </div>

      <p style={{
        fontSize: 10, color: "#9ca3af", textAlign: "center",
        margin: "12px 0 0",
      }}>
        Eklediğiniz özellikler fiyata yansır
      </p>
    </div>
  );
}
