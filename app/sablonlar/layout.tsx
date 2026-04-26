import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Şablonlar",
  description:
    "Yüzlerce hazır davetiye şablonu arasından seçin. Düğün, nişan, doğum günü ve daha fazlası.",
};

export default function SablonlarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}