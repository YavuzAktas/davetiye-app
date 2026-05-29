"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";

type FaturaBilgileri = {
  faturaTipi: "bireysel" | "kurumsal";
  adSoyad: string;
  telefon: string;
  kimlikVergiNo: string;
  sehir: string;
  adres: string;
};

type FaturaHatalari = Partial<Record<keyof FaturaBilgileri | "genel" | "onay", string>>;

const BOS_FATURA: FaturaBilgileri = {
  faturaTipi: "bireysel",
  adSoyad: "",
  telefon: "",
  kimlikVergiNo: "",
  sehir: "",
  adres: "",
};

function telefonGecerli(deger: string) {
  const rakamlar = deger.replace(/\D/g, "");
  return (
    (rakamlar.length === 10 && rakamlar.startsWith("5")) ||
    (rakamlar.length === 11 && rakamlar.startsWith("05")) ||
    (rakamlar.length === 12 && rakamlar.startsWith("90"))
  );
}

export default function OdemeCheckoutForm({ davetiyeId }: { davetiyeId: string }) {
  const { data: session } = useSession();
  const [fatura, setFatura] = useState<FaturaBilgileri>(BOS_FATURA);
  const [hatalar, setHatalar] = useState<FaturaHatalari>({});
  const [onay, setOnay] = useState(false);
  const [yukleniyor, setYukleniyor] = useState(false);
  const [odeModal, setOdeModal] = useState<string | null>(null);
  const [kredi, setKredi] = useState(0);
  const [krediUygula, setKrediUygula] = useState(false);

  useEffect(() => {
    if (!session?.user?.id) return;
    fetch("/api/referral/kredi")
      .then(r => r.json())
      .then(d => { if (d.kredi > 0) { setKredi(d.kredi); setKrediUygula(true); } })
      .catch(() => {});
  }, [session?.user?.id]);

  useEffect(() => {
    if (!session?.user?.name || fatura.adSoyad) return;
    setFatura(prev => ({ ...prev, adSoyad: session.user?.name ?? "" }));
  }, [session?.user?.name, fatura.adSoyad]);

  useEffect(() => {
    if (!odeModal) return;
    const injected: HTMLScriptElement[] = [];
    const tmp = document.createElement("div");
    tmp.innerHTML = odeModal;
    tmp.querySelectorAll("script").forEach(old => {
      const script = document.createElement("script");
      script.setAttribute("data-iyzico-script", "");
      if (old.src) script.src = old.src;
      else script.text = old.textContent ?? "";
      document.body.appendChild(script);
      injected.push(script);
    });
    return () => { injected.forEach(s => s.remove()); };
  }, [odeModal]);

  const alanGuncelle = (alan: keyof FaturaBilgileri, deger: string) => {
    setFatura(prev => ({ ...prev, [alan]: deger }));
    setHatalar(prev => ({ ...prev, [alan]: undefined, genel: undefined }));
  };

  const dogrula = () => {
    const yeniHatalar: FaturaHatalari = {};
    const kurumsal = fatura.faturaTipi === "kurumsal";
    if (fatura.adSoyad.trim().length < 3 || (!kurumsal && !fatura.adSoyad.trim().includes(" ")))
      yeniHatalar.adSoyad = kurumsal ? "Unvan veya yetkili ad soyad girin." : "Ad ve soyad girin.";
    if (!telefonGecerli(fatura.telefon))
      yeniHatalar.telefon = "Geçerli bir mobil numara girin. Örnek: 05xxxxxxxxx";
    if (fatura.sehir.trim().length < 2)
      yeniHatalar.sehir = "Şehir bilgisini girin.";
    if (kurumsal && !/^\d{10,11}$/.test(fatura.kimlikVergiNo))
      yeniHatalar.kimlikVergiNo = "Vergi no veya TCKN 10 ya da 11 haneli olmalıdır.";
    if (kurumsal && fatura.adres.trim().length < 10)
      yeniHatalar.adres = "Fatura adresi en az 10 karakter olmalıdır.";
    if (!onay)
      yeniHatalar.onay = "Ödeme öncesi yasal bilgilendirme onayını işaretleyin.";
    setHatalar(yeniHatalar);
    return Object.keys(yeniHatalar).length === 0;
  };

  const odemeBaslat = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!dogrula()) return;
    setYukleniyor(true);
    try {
      const res = await fetch("/api/odeme/baslat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ davetiyeId, faturaBilgileri: fatura, krediUygula: krediUygula && kredi > 0 }),
      });
      const data = await res.json();
      if (data.checkoutFormContent) {
        setOdeModal(data.checkoutFormContent);
      } else {
        setHatalar({ genel: data.hata ?? "Ödeme başlatılamadı, tekrar deneyin." });
      }
    } catch {
      setHatalar({ genel: "Ödeme başlatılırken bir hata oluştu." });
    } finally {
      setYukleniyor(false);
    }
  };

  const inputBase: React.CSSProperties = {
    width: "100%",
    borderRadius: 12,
    padding: "11px 14px",
    fontSize: 14,
    color: "#111827",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
    boxSizing: "border-box",
  };

  const inputStyle = (alan: keyof FaturaBilgileri): React.CSSProperties => ({
    ...inputBase,
    border: `1px solid ${hatalar[alan] ? "rgba(239,68,68,0.5)" : "#d1d5db"}`,
    background: hatalar[alan] ? "rgba(239,68,68,0.05)" : "#ffffff",
  });

  return (
    <>
      <style>{`
        .co-input::placeholder { color: #9ca3af; }
        .co-input:focus { border-color: rgba(124,58,237,0.6) !important; box-shadow: 0 0 0 3px rgba(124,58,237,0.1) !important; }
        @keyframes co-spin { to { transform: rotate(360deg); } }
      `}</style>

      {/* iyzico modal */}
      {odeModal && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 50,
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.55)", backdropFilter: "blur(8px)", padding: 16,
          }}
          onClick={e => { if (e.currentTarget === e.target) setOdeModal(null); }}
        >
          <div style={{
            width: "100%", maxWidth: 440, borderRadius: 24, overflow: "hidden",
            background: "#fff", boxShadow: "0 32px 80px rgba(0,0,0,0.25)",
          }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderBottom: "1px solid #f3f4f6", padding: "16px 20px",
            }}>
              <div>
                <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.2em", color: "#7c3aed", textTransform: "uppercase" }}>Güvenli Ödeme</p>
                <p style={{ fontSize: 14, fontWeight: 600, color: "#111", marginTop: 2 }}>iyzico ile ödeme</p>
              </div>
              <button
                type="button"
                onClick={() => setOdeModal(null)}
                style={{
                  width: 32, height: 32, borderRadius: "50%", border: "none",
                  background: "#f3f4f6", color: "#6b7280", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18,
                }}
              >×</button>
            </div>
            <div style={{ maxHeight: "80dvh", overflowY: "auto" }}>
              <div id="iyzipay-checkout-form" className="responsive" />
            </div>
          </div>
        </div>
      )}

      <form onSubmit={odemeBaslat} noValidate>
        {/* Bireysel / Kurumsal */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5,
          borderRadius: 14, border: "1px solid #e5e7eb",
          background: "#f3f4f6", padding: 4, marginBottom: 22,
        }}>
          {(["bireysel", "kurumsal"] as const).map(tip => (
            <button
              key={tip}
              type="button"
              onClick={() => alanGuncelle("faturaTipi", tip)}
              style={{
                borderRadius: 10, padding: "10px 12px", fontSize: 13, fontWeight: 600,
                border: "none", cursor: "pointer", transition: "all 0.2s",
                background: fatura.faturaTipi === tip ? "#ffffff" : "transparent",
                color: fatura.faturaTipi === tip ? "#1f2937" : "#9ca3af",
                boxShadow: fatura.faturaTipi === tip ? "0 1px 4px rgba(0,0,0,0.1)" : "none",
              }}
            >
              {tip === "bireysel" ? "Bireysel" : "Kurumsal"}
            </button>
          ))}
        </div>

        {hatalar.genel && (
          <div style={{
            background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.25)",
            borderRadius: 12, padding: "10px 14px", fontSize: 13, color: "#dc2626", marginBottom: 16,
          }}>
            {hatalar.genel}
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          <label style={{ display: "block" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>
              {fatura.faturaTipi === "kurumsal" ? "Unvan / Yetkili" : "Ad Soyad"}
            </span>
            <input
              className="co-input"
              value={fatura.adSoyad}
              onChange={e => alanGuncelle("adSoyad", e.target.value)}
              style={inputStyle("adSoyad")}
            />
            {hatalar.adSoyad && <span style={{ fontSize: 11, color: "#dc2626", marginTop: 5, display: "block" }}>{hatalar.adSoyad}</span>}
          </label>

          <label style={{ display: "block" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Telefon</span>
            <input
              className="co-input"
              value={fatura.telefon}
              onChange={e => alanGuncelle("telefon", e.target.value)}
              placeholder="05xxxxxxxxx"
              style={inputStyle("telefon")}
            />
            {hatalar.telefon && <span style={{ fontSize: 11, color: "#dc2626", marginTop: 5, display: "block" }}>{hatalar.telefon}</span>}
          </label>

          <label style={{ display: "block" }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Şehir</span>
            <input
              className="co-input"
              value={fatura.sehir}
              onChange={e => alanGuncelle("sehir", e.target.value)}
              style={inputStyle("sehir")}
            />
            {hatalar.sehir && <span style={{ fontSize: 11, color: "#dc2626", marginTop: 5, display: "block" }}>{hatalar.sehir}</span>}
          </label>

          {fatura.faturaTipi === "kurumsal" && (
            <>
              <label style={{ display: "block" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Vergi No / TCKN</span>
                <input
                  className="co-input"
                  value={fatura.kimlikVergiNo}
                  onChange={e => alanGuncelle("kimlikVergiNo", e.target.value)}
                  style={inputStyle("kimlikVergiNo")}
                />
                {hatalar.kimlikVergiNo && <span style={{ fontSize: 11, color: "#dc2626", marginTop: 5, display: "block" }}>{hatalar.kimlikVergiNo}</span>}
              </label>
              <label style={{ display: "block" }}>
                <span style={{ fontSize: 12, fontWeight: 600, color: "#6b7280", display: "block", marginBottom: 6 }}>Fatura Adresi</span>
                <textarea
                  className="co-input"
                  value={fatura.adres}
                  onChange={e => alanGuncelle("adres", e.target.value)}
                  rows={2}
                  style={{ ...inputStyle("adres"), resize: "none" }}
                />
                {hatalar.adres && <span style={{ fontSize: 11, color: "#dc2626", marginTop: 5, display: "block" }}>{hatalar.adres}</span>}
              </label>
            </>
          )}
        </div>

        {/* Referral kredi banner */}
        {kredi > 0 && (
          <div
            style={{
              marginTop: 20,
              borderRadius: 14,
              padding: "14px 16px",
              background: krediUygula ? "rgba(139,92,246,0.08)" : "#f9fafb",
              border: `1px solid ${krediUygula ? "rgba(139,92,246,0.35)" : "#e5e7eb"}`,
              display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12,
              cursor: "pointer", transition: "all 0.2s",
            }}
            onClick={() => setKrediUygula(p => !p)}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{
                width: 36, height: 36, borderRadius: 10, flexShrink: 0,
                background: "linear-gradient(135deg,#7c3aed,#db2777)",
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16,
              }}>🎁</div>
              <div>
                <p style={{ fontSize: 13, fontWeight: 700, color: "#1f2937", margin: 0 }}>{kredi}₺ Bekleriz krediniz var</p>
                <p style={{ fontSize: 11, color: "#6b7280", margin: 0, marginTop: 2 }}>
                  {krediUygula ? "Ödemeye uygulandı ✓" : "Uygulamak için tıklayın"}
                </p>
              </div>
            </div>
            <div style={{
              width: 20, height: 20, borderRadius: 6, border: `2px solid ${krediUygula ? "#a855f7" : "#d1d5db"}`,
              background: krediUygula ? "#7c3aed" : "transparent",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0, transition: "all 0.2s",
            }}>
              {krediUygula && <span style={{ color: "#fff", fontSize: 12, fontWeight: 700 }}>✓</span>}
            </div>
          </div>
        )}

        {/* Legal checkbox */}
        <label style={{
          display: "flex", gap: 12, cursor: "pointer", marginTop: 20,
          borderRadius: 14, padding: "14px 16px",
          background: hatalar.onay ? "rgba(239,68,68,0.05)" : "#f9fafb",
          border: `1px solid ${hatalar.onay ? "rgba(239,68,68,0.25)" : "#e5e7eb"}`,
        }}>
          <input
            type="checkbox"
            checked={onay}
            onChange={e => {
              setOnay(e.target.checked);
              if (e.target.checked) setHatalar(prev => ({ ...prev, onay: undefined }));
            }}
            style={{ marginTop: 2, width: 16, height: 16, accentColor: "#7c3aed", cursor: "pointer", flexShrink: 0 }}
          />
          <span style={{ fontSize: 11, lineHeight: 1.75, color: "#6b7280" }}>
            <Link href="/on-bilgilendirme" target="_blank" style={{ color: "#7c3aed", textDecoration: "underline" }}>Ön Bilgilendirme</Link>
            {", "}
            <Link href="/mesafeli-satis-sozlesmesi" target="_blank" style={{ color: "#7c3aed", textDecoration: "underline" }}>Mesafeli Satış Sözleşmesi</Link>
            {" ve "}
            <Link href="/kullanim-sartlari" target="_blank" style={{ color: "#7c3aed", textDecoration: "underline" }}>Kullanım Şartları</Link>
            {"'nı okudum; dijital hizmetin ödeme sonrası başlamasını kabul ediyorum."}
          </span>
        </label>
        {hatalar.onay && <p style={{ fontSize: 11, color: "#dc2626", marginTop: 8 }}>{hatalar.onay}</p>}

        <button
          type="submit"
          disabled={yukleniyor}
          style={{
            width: "100%", marginTop: 20,
            padding: "16px 24px", borderRadius: 16, border: "none",
            cursor: yukleniyor ? "not-allowed" : "pointer",
            background: "linear-gradient(135deg, #7C3AED 0%, #9333EA 50%, #DB2777 100%)",
            color: "#fff", fontWeight: 700, fontSize: 15,
            boxShadow: "0 8px 32px rgba(124,58,237,0.35)",
            opacity: yukleniyor ? 0.65 : 1,
            transition: "opacity 0.2s, transform 0.2s",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}
        >
          {yukleniyor ? (
            <>
              <span style={{
                width: 16, height: 16, borderRadius: "50%", display: "inline-block",
                border: "2px solid rgba(255,255,255,0.3)", borderTop: "2px solid #fff",
                animation: "co-spin 0.75s linear infinite",
              }}/>
              Ödeme hazırlanıyor...
            </>
          ) : (
            <>🔒 Güvenli Ödemeye Geç</>
          )}
        </button>
      </form>
    </>
  );
}
