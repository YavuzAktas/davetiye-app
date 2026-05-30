import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

function escapeHtml(value: string | number) {
  return String(value).replace(/[&<>"']/g, (char) => HTML_ESCAPE_MAP[char]);
}

function sanitizeSubject(value: string) {
  return value
    .replace(/[\r\n]+/g, " ")
    .replace(/[\u0000-\u001f\u007f]/g, "")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 180);
}

export async function rsvpBildirimiGonder({
  sahipEmail,
  sahipAd,
  davetiyeBaslik,
  davetiyeSlug,
  misafirAd,
  katilim,
  kisiSayisi,
  misafirNot,
}: {
  sahipEmail: string;
  sahipAd: string;
  davetiyeBaslik: string;
  davetiyeSlug: string;
  misafirAd: string;
  katilim: boolean;
  kisiSayisi: number;
  misafirNot?: string | null;
}) {
  const dashboardUrl = `${process.env.NEXT_PUBLIC_URL}/dashboard/davetiye/${encodeURIComponent(davetiyeSlug)}`;
  const guvenliSahipAd = escapeHtml(sahipAd);
  const guvenliDavetiyeBaslik = escapeHtml(davetiyeBaslik);
  const guvenliMisafirAd = escapeHtml(misafirAd);
  const guvenliMisafirNot = misafirNot ? escapeHtml(misafirNot) : null;
  const guvenliKisiSayisi = escapeHtml(Math.max(0, Math.trunc(kisiSayisi)));
  const guvenliDashboardUrl = escapeHtml(dashboardUrl);
  const subject = sanitizeSubject(`${katilim ? "🎉" : "😔"} ${misafirAd} - ${davetiyeBaslik}`);

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
    </head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        
        <div style="background:${katilim ? "#059669" : "#6b7280"};padding:24px;text-align:center;">
          <p style="color:white;font-size:32px;margin:0;">${katilim ? "🎉" : "😔"}</p>
          <h1 style="color:white;font-size:18px;margin:8px 0 0;font-weight:600;">
            ${katilim ? "Yeni katılım bildirimi!" : "Katılamayacak bildirimi"}
          </h1>
        </div>

        <div style="padding:24px;">
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">
            Merhaba <strong>${guvenliSahipAd}</strong>,
          </p>
          <p style="color:#374151;font-size:15px;margin:0 0 20px;">
            <strong>${guvenliDavetiyeBaslik}</strong> davetiyeniz için yeni bir bildirim var.
          </p>

          <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:20px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:4px 0;">Misafir</td>
                <td style="color:#111827;font-size:13px;font-weight:500;text-align:right;">${guvenliMisafirAd}</td>
              </tr>
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:4px 0;">Durum</td>
                <td style="text-align:right;">
                  <span style="background:${katilim ? "#d1fae5" : "#fee2e2"};color:${katilim ? "#065f46" : "#991b1b"};font-size:12px;padding:2px 10px;border-radius:20px;font-weight:500;">
                    ${katilim ? "Katılıyor" : "Katılamıyor"}
                  </span>
                </td>
              </tr>
              ${katilim ? `
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:4px 0;">Kişi sayısı</td>
                <td style="color:#111827;font-size:13px;font-weight:500;text-align:right;">${guvenliKisiSayisi} kişi</td>
              </tr>
              ` : ""}
              ${guvenliMisafirNot ? `
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:4px 0;vertical-align:top;">Not</td>
                <td style="color:#111827;font-size:13px;text-align:right;font-style:italic;">"${guvenliMisafirNot}"</td>
              </tr>
              ` : ""}
            </table>
          </div>

          <a href="${guvenliDashboardUrl}" style="display:block;background:#7c3aed;color:white;text-align:center;padding:12px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:500;">
            Tüm katılımları görüntüle
          </a>
        </div>

        <div style="padding:16px 24px;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">
            Bu e-posta bekleriz.com tarafından gönderildi.
          </p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: sahipEmail,
      subject,
      html,
    });
  } catch (error) {
    console.error("E-posta gönderilemedi:", error);
  }
}

export async function odemeHatirlatmaGonder({
  email,
  adSoyad,
  davetiyeBaslik,
  davetiyeSlug,
  tip,
}: {
  email: string;
  adSoyad: string;
  davetiyeBaslik: string;
  davetiyeSlug: string;
  tip: "30dk" | "24saat";
}) {
  const odemeUrl = `${process.env.NEXT_PUBLIC_URL}/odeme/${encodeURIComponent(davetiyeSlug)}`;
  const guvenliAd = escapeHtml(adSoyad);
  const guvenliBaslik = escapeHtml(davetiyeBaslik);
  const guvenliUrl = escapeHtml(odemeUrl);

  const ilkMi = tip === "30dk";

  const subject = sanitizeSubject(
    ilkMi
      ? `Davetiyeniz hazır — sadece ödeme kaldı 🎉`
      : `⏰ Son hatırlatma: "${davetiyeBaslik}" sizi bekliyor`
  );

  const html = `<!DOCTYPE html>
<html lang="tr">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
</head>
<body style="margin:0;padding:0;background:#05000d;font-family:system-ui,-apple-system,sans-serif;">
  <div style="max-width:540px;margin:40px auto;border-radius:20px;overflow:hidden;border:1px solid rgba(255,255,255,0.1);background:#0c0120;">

    <!-- Header gradient bar -->
    <div style="height:4px;background:linear-gradient(90deg,#7C3AED,#DB2777);"></div>

    <!-- Hero -->
    <div style="padding:40px 36px 32px;text-align:center;background:linear-gradient(160deg,rgba(124,58,237,0.12) 0%,rgba(219,39,119,0.06) 100%);">
      <div style="font-size:44px;margin-bottom:16px;">${ilkMi ? "🎉" : "⏰"}</div>
      <h1 style="color:#ffffff;font-size:22px;font-weight:800;margin:0 0 10px;letter-spacing:-0.3px;">
        ${ilkMi ? "Davetiyeniz hazır!" : "Davetiyenizi kaybetmeyin"}
      </h1>
      <p style="color:rgba(255,255,255,0.45);font-size:14px;margin:0;line-height:1.6;">
        ${ilkMi
          ? "Ödemenizi tamamlayın, misafirlerinizle hemen paylaşın."
          : "Davetiyeniz oluşturuldu ama henüz yayına alınmadı."}
      </p>
    </div>

    <!-- Content -->
    <div style="padding:28px 36px;">
      <p style="color:rgba(255,255,255,0.7);font-size:15px;margin:0 0 20px;">
        Merhaba <strong style="color:#fff;">${guvenliAd}</strong>,
      </p>

      <!-- Invitation card -->
      <div style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;padding:18px 20px;margin-bottom:24px;">
        <p style="color:rgba(255,255,255,0.35);font-size:11px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;margin:0 0 8px;">Davetiye</p>
        <p style="color:#fff;font-size:17px;font-weight:700;margin:0 0 6px;">${guvenliBaslik}</p>
        <p style="color:rgba(255,255,255,0.4);font-size:13px;margin:0;">
          ✓ Davetiye hazır &nbsp;·&nbsp; ✓ Şablon seçildi &nbsp;·&nbsp; ⏳ Ödeme bekleniyor
        </p>
      </div>

      <p style="color:rgba(255,255,255,0.55);font-size:14px;line-height:1.7;margin:0 0 28px;">
        ${ilkMi
          ? "Ödemenizi tamamladığınız anda davetiyeniz yayına alınacak ve misafirlerinizle paylaşabileceksiniz."
          : "Ödemenizi bugün tamamlayın — davetiyeniz hazır, misafirleriniz sizi bekliyor."}
      </p>

      <!-- CTA -->
      <div style="text-align:center;margin-bottom:24px;">
        <a href="${guvenliUrl}"
           style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#DB2777);color:#fff;text-decoration:none;padding:14px 36px;border-radius:12px;font-size:15px;font-weight:700;letter-spacing:0.01em;"
           onmouseover="this.style.opacity='0.9'"
           onmouseout="this.style.opacity='1'">
          Ödemeyi Tamamla →
        </a>
      </div>

      ${ilkMi ? `
      <!-- Trust signals -->
      <div style="display:flex;justify-content:center;gap:20px;flex-wrap:wrap;margin-bottom:8px;">
        ${["🔒 SSL Şifreli", "✅ iyzico", "💳 3D Secure"].map(t =>
          `<span style="color:rgba(255,255,255,0.25);font-size:12px;">${escapeHtml(t)}</span>`
        ).join("")}
      </div>` : ""}
    </div>

    <!-- Footer -->
    <div style="border-top:1px solid rgba(255,255,255,0.07);padding:18px 36px;text-align:center;">
      <p style="color:rgba(255,255,255,0.2);font-size:12px;margin:0;">
        © 2025 Bekleriz &nbsp;·&nbsp;
        <a href="mailto:destek@bekleriz.com" style="color:rgba(124,58,237,0.7);text-decoration:none;">destek@bekleriz.com</a>
      </p>
    </div>
  </div>
</body>
</html>`;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject,
      html,
    });
  } catch (error) {
    console.error("Ödeme hatırlatma maili gönderilemedi:", error);
    throw error;
  }
}

export async function sifreSifirlamaGonder(email: string, resetUrl: string) {
  const guvenliResetUrl = escapeHtml(resetUrl);
  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,sans-serif;">
      <div style="max-width:520px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#DB2777);padding:32px;text-align:center;">
          <p style="color:white;font-size:32px;margin:0;">🔐</p>
          <h1 style="color:white;font-size:20px;margin:10px 0 0;font-weight:600;">Şifre Sıfırlama</h1>
        </div>
        <div style="padding:32px;">
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">
            Bekleriz hesabınız için şifre sıfırlama talebinde bulundunuz.
          </p>
          <p style="color:#374151;font-size:15px;margin:0 0 28px;">
            Aşağıdaki butona tıklayarak yeni şifrenizi belirleyebilirsiniz.
            Bu bağlantı <strong>1 saat</strong> geçerlidir.
          </p>
          <div style="text-align:center;margin-bottom:28px;">
            <a href="${guvenliResetUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#DB2777);color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:600;font-size:15px;">
              Şifremi Sıfırla
            </a>
          </div>
          <p style="color:#9ca3af;font-size:12px;margin:0;line-height:1.6;">
            Bu talebi siz yapmadıysanız bu e-postayı görmezden gelebilirsiniz.
            Şifreniz değişmeyecektir.<br><br>
            Bağlantı çalışmıyorsa şu adresi tarayıcınıza kopyalayın:<br>
            <span style="color:#7C3AED;word-break:break-all;">${guvenliResetUrl}</span>
          </p>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:11px;margin:0;">© 2025 Bekleriz · destek@bekleriz.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Bekleriz — Şifre Sıfırlama",
      html,
    });
  } catch (error) {
    console.error("Şifre sıfırlama e-postası gönderilemedi:", error);
    throw error;
  }
}

export async function partnerBasvuruAdminBildir({
  partnerAdi,
  firmaAdi,
  email,
  firmaTuru,
  aylikMusteriSayisi,
  basvuruNotu,
  adminPanelUrl,
  adminEmails,
}: {
  partnerAdi: string;
  firmaAdi: string;
  email: string;
  firmaTuru: string;
  aylikMusteriSayisi: string;
  basvuruNotu?: string;
  adminPanelUrl: string;
  adminEmails: string[];
}) {
  const guvenliPartnerAdi = escapeHtml(partnerAdi);
  const guvenliFiremaAdi = escapeHtml(firmaAdi);
  const guvenliEmail = escapeHtml(email);
  const guvenlifirmaTuru = escapeHtml(firmaTuru);
  const guvenliAylik = escapeHtml(aylikMusteriSayisi);
  const guvenliNot = basvuruNotu ? escapeHtml(basvuruNotu) : "—";
  const guvenliUrl = encodeURI(adminPanelUrl);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,sans-serif;">
      <div style="max-width:560px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#DB2777);padding:28px;text-align:center;">
          <p style="color:white;font-size:28px;margin:0;">🤝</p>
          <h1 style="color:white;font-size:18px;margin:8px 0 0;font-weight:700;">Yeni Partner Başvurusu</h1>
        </div>
        <div style="padding:28px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;">
            <tr><td style="padding:8px 0;color:#6b7280;width:40%;">Firma Adı</td><td style="padding:8px 0;color:#111827;font-weight:600;">${guvenliFiremaAdi}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Ad Soyad</td><td style="padding:8px 0;color:#111827;">${guvenliPartnerAdi}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">E-posta</td><td style="padding:8px 0;color:#7C3AED;">${guvenliEmail}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Firma Türü</td><td style="padding:8px 0;color:#111827;">${guvenlifirmaTuru}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Aylık Müşteri</td><td style="padding:8px 0;color:#111827;">${guvenliAylik}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;vertical-align:top;">Not</td><td style="padding:8px 0;color:#111827;">${guvenliNot}</td></tr>
          </table>
          <div style="margin-top:24px;text-align:center;">
            <a href="${guvenliUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#DB2777);color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">Admin Panelinde İncele</a>
          </div>
        </div>
        <div style="background:#f9fafb;padding:14px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:11px;margin:0;">© 2025 Bekleriz — Partner Admin Bildirimi</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: adminEmails,
      subject: sanitizeSubject(`Yeni Partner Başvurusu — ${firmaAdi}`),
      html,
    });
  } catch (error) {
    console.error("Partner başvuru admin bildirimi gönderilemedi:", error);
  }
}

export async function partnerOnayBildir({
  email,
  partnerAdi,
  firmaAdi,
  panelUrl,
}: {
  email: string;
  partnerAdi: string;
  firmaAdi: string;
  panelUrl: string;
}) {
  const guvenliPartnerAdi = escapeHtml(partnerAdi);
  const guvenliFiremaAdi = escapeHtml(firmaAdi);
  const guvenliUrl = encodeURI(panelUrl);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,sans-serif;">
      <div style="max-width:520px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#DB2777);padding:32px;text-align:center;">
          <p style="color:white;font-size:32px;margin:0;">🎉</p>
          <h1 style="color:white;font-size:20px;margin:10px 0 0;font-weight:700;">Partner Başvurunuz Onaylandı!</h1>
        </div>
        <div style="padding:32px;">
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">Merhaba ${guvenliPartnerAdi},</p>
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">
            <strong>${guvenliFiremaAdi}</strong> adına yaptığınız partner başvurusu onaylandı.
            Artık partner panelinize erişebilir, aktivasyon hakları satın alabilir ve müşterilerinize dijital davetiye sunabilirsiniz.
          </p>
          <div style="text-align:center;margin:28px 0;">
            <a href="${guvenliUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#DB2777);color:white;padding:14px 32px;border-radius:12px;text-decoration:none;font-weight:700;font-size:15px;">Partner Paneline Git →</a>
          </div>
          <p style="color:#9ca3af;font-size:13px;margin:0;">Sorularınız için <a href="mailto:destek@bekleriz.com" style="color:#7C3AED;">destek@bekleriz.com</a> adresinden bize ulaşabilirsiniz.</p>
        </div>
        <div style="background:#f9fafb;padding:16px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:11px;margin:0;">© 2025 Bekleriz · destek@bekleriz.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: email,
      subject: "Bekleriz Partner Başvurunuz Onaylandı 🎉",
      html,
    });
  } catch (error) {
    console.error("Partner onay e-postası gönderilemedi:", error);
  }
}

export async function aktivasyonKoduKullanilanBildir({
  partnerEmail,
  firmaAdi,
  musteriEmail,
  kod,
  panelUrl,
}: {
  partnerEmail: string;
  firmaAdi: string;
  musteriEmail: string;
  kod: string;
  panelUrl: string;
}) {
  const guvenliFiremaAdi = escapeHtml(firmaAdi);
  const guvenliMusteriEmail = escapeHtml(musteriEmail);
  const guvenliKod = escapeHtml(kod);
  const guvenliUrl = encodeURI(panelUrl);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,sans-serif;">
      <div style="max-width:520px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#DB2777);padding:28px;text-align:center;">
          <p style="color:white;font-size:28px;margin:0;">👤</p>
          <h1 style="color:white;font-size:18px;margin:8px 0 0;font-weight:700;">Müşteriniz Kaydoldu</h1>
        </div>
        <div style="padding:28px;">
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">
            <strong>${guvenliFiremaAdi}</strong> adına oluşturduğunuz aktivasyon kodunu bir müşteri kullandı.
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
            <tr><td style="padding:8px 0;color:#6b7280;width:40%;">Müşteri</td><td style="padding:8px 0;color:#7C3AED;">${guvenliMusteriEmail}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Kod</td><td style="padding:8px 0;color:#111827;font-family:monospace;font-weight:600;">${guvenliKod}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Durum</td><td style="padding:8px 0;color:#d97706;font-weight:600;">Davetiye oluşturuluyor</td></tr>
          </table>
          <div style="text-align:center;">
            <a href="${guvenliUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#DB2777);color:white;padding:12px 28px;border-radius:10px;text-decoration:none;font-weight:600;font-size:14px;">Partner Panelinde Görüntüle</a>
          </div>
        </div>
        <div style="background:#f9fafb;padding:14px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:11px;margin:0;">© 2025 Bekleriz · destek@bekleriz.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: partnerEmail,
      subject: sanitizeSubject(`Müşteriniz aktivasyon kodunu kullandı — ${firmaAdi}`),
      html,
    });
  } catch (error) {
    console.error("Aktivasyon kodu kullanılan bildirimi gönderilemedi:", error);
  }
}

export async function davetiyeYayindaBildir({
  partnerEmail,
  firmaAdi,
  musteriEmail,
  davetiyeBaslik,
  davetiyeUrl,
  panelUrl,
}: {
  partnerEmail: string;
  firmaAdi: string;
  musteriEmail: string;
  davetiyeBaslik: string;
  davetiyeUrl: string;
  panelUrl: string;
}) {
  const guvenliFiremaAdi = escapeHtml(firmaAdi);
  const guvenliMusteriEmail = escapeHtml(musteriEmail);
  const guvenliBaslik = escapeHtml(davetiyeBaslik);
  const guvenliDavetiyeUrl = encodeURI(davetiyeUrl);
  const guvenliPanelUrl = encodeURI(panelUrl);

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
    <body style="margin:0;padding:0;background:#f9fafb;font-family:system-ui,sans-serif;">
      <div style="max-width:520px;margin:40px auto;background:white;border-radius:16px;overflow:hidden;border:1px solid #e5e7eb;">
        <div style="background:linear-gradient(135deg,#7C3AED,#DB2777);padding:28px;text-align:center;">
          <p style="color:white;font-size:28px;margin:0;">🎉</p>
          <h1 style="color:white;font-size:18px;margin:8px 0 0;font-weight:700;">Davetiye Yayınlandı!</h1>
        </div>
        <div style="padding:28px;">
          <p style="color:#374151;font-size:15px;margin:0 0 16px;">
            <strong>${guvenliFiremaAdi}</strong> aracılığıyla bir müşteriniz davetiyesini oluşturdu ve yayınladı.
          </p>
          <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:20px;">
            <tr><td style="padding:8px 0;color:#6b7280;width:40%;">Müşteri</td><td style="padding:8px 0;color:#7C3AED;">${guvenliMusteriEmail}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Davetiye</td><td style="padding:8px 0;color:#111827;font-weight:600;">${guvenliBaslik}</td></tr>
            <tr><td style="padding:8px 0;color:#6b7280;">Durum</td><td style="padding:8px 0;color:#16a34a;font-weight:600;">✓ Yayında</td></tr>
          </table>
          <div style="display:flex;gap:12px;justify-content:center;flex-wrap:wrap;">
            <a href="${guvenliDavetiyeUrl}" style="display:inline-block;background:#f3f4f6;color:#374151;padding:10px 20px;border-radius:10px;text-decoration:none;font-weight:600;font-size:13px;">Davetiyeyi Gör</a>
            <a href="${guvenliPanelUrl}" style="display:inline-block;background:linear-gradient(135deg,#7C3AED,#DB2777);color:white;padding:10px 20px;border-radius:10px;text-decoration:none;font-weight:600;font-size:13px;">Partner Paneli</a>
          </div>
        </div>
        <div style="background:#f9fafb;padding:14px;text-align:center;border-top:1px solid #e5e7eb;">
          <p style="color:#9ca3af;font-size:11px;margin:0;">© 2025 Bekleriz · destek@bekleriz.com</p>
        </div>
      </div>
    </body>
    </html>
  `;

  try {
    await resend.emails.send({
      from: process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev",
      to: partnerEmail,
      subject: sanitizeSubject(`Müşterinizin davetiyesi yayınlandı — ${davetiyeBaslik}`),
      html,
    });
  } catch (error) {
    console.error("Davetiye yayında bildirimi gönderilemedi:", error);
  }
}
