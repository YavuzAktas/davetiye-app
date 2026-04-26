import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Fiyatlar",
  description:
    "Davetim fiyat planları. Ücretsiz başla, ihtiyacına göre yükselt.",
};

export default function FiyatlarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}