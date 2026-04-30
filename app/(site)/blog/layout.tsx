import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog & Rehber",
  description:
    "Dijital davetiye rehberleri, düğün ipuçları, davetiye sözleri ve daha fazlası. Bekleriz Blog'da aradığınız her bilgi burada.",
  keywords: [
    "davetiye rehberi", "düğün ipuçları", "davetiye sözleri",
    "dijital davetiye nasıl yapılır", "whatsapp davetiye",
  ],
  alternates: { canonical: "/blog" },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
