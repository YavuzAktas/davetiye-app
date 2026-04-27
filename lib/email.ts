import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY ?? "");

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
  const dashboardUrl = `${process.env.NEXT_PUBLIC_URL}/dashboard/davetiye/${davetiyeSlug}`;

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
            Merhaba <strong>${sahipAd}</strong>,
          </p>
          <p style="color:#374151;font-size:15px;margin:0 0 20px;">
            <strong>${davetiyeBaslik}</strong> davetiyeniz için yeni bir bildirim var.
          </p>

          <div style="background:#f9fafb;border-radius:12px;padding:16px;margin-bottom:20px;">
            <table style="width:100%;border-collapse:collapse;">
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:4px 0;">Misafir</td>
                <td style="color:#111827;font-size:13px;font-weight:500;text-align:right;">${misafirAd}</td>
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
                <td style="color:#111827;font-size:13px;font-weight:500;text-align:right;">${kisiSayisi} kişi</td>
              </tr>
              ` : ""}
              ${misafirNot ? `
              <tr>
                <td style="color:#6b7280;font-size:13px;padding:4px 0;vertical-align:top;">Not</td>
                <td style="color:#111827;font-size:13px;text-align:right;font-style:italic;">"${misafirNot}"</td>
              </tr>
              ` : ""}
            </table>
          </div>

          <a href="${dashboardUrl}" style="display:block;background:#7c3aed;color:white;text-align:center;padding:12px;border-radius:10px;text-decoration:none;font-size:14px;font-weight:500;">
            Tüm katılımları görüntüle
          </a>
        </div>

        <div style="padding:16px 24px;border-top:1px solid #e5e7eb;text-align:center;">
          <p style="color:#9ca3af;font-size:12px;margin:0;">
            Bu e-posta davetim.com tarafından gönderildi.
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
      subject: `${katilim ? "🎉" : "😔"} ${misafirAd} - ${davetiyeBaslik}`,
      html,
    });
  } catch (error) {
    console.error("E-posta gönderilemedi:", error);
  }
}