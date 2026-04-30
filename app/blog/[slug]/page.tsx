import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import { getAllSlugs, getPostBySlug, formatDate } from "@/lib/blog";

/* ── Statik parametre üretimi (build time) ── */
export async function generateStaticParams() {
  return getAllSlugs().map(slug => ({ slug }));
}

/* ── Sayfa-özel SEO metadata ── */
export async function generateMetadata(
  { params }: { params: Promise<{ slug: string }> }
): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    keywords: post.tags,
    alternates: { canonical: `/blog/${slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
      url: `/blog/${slug}`,
    },
  };
}

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "Rehber": { bg: "rgba(124,58,237,0.1)",  text: "#7c3aed" },
  "İpucu":  { bg: "rgba(236,72,153,0.1)",  text: "#db2777" },
  "İlham":  { bg: "rgba(245,158,11,0.1)",  text: "#d97706" },
};

export default async function BlogPostPage(
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  /* JSON-LD: Article schema */
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    dateModified: post.date,
    author: { "@type": "Organization", name: "Davetim" },
    publisher: {
      "@type": "Organization",
      name: "Davetim",
      url: "https://davetiye-app.vercel.app",
    },
    keywords: post.tags.join(", "),
  };

  const cat = CATEGORY_COLORS[post.category] ?? { bg: "rgba(124,58,237,0.1)", text: "#7c3aed" };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      {/* ── Prose stilleri ── */}
      <style>{`
        .prose h2 { font-size:1.35rem; font-weight:800; color:#111827; margin:2rem 0 0.75rem; }
        .prose h3 { font-size:1.1rem;  font-weight:700; color:#374151; margin:1.5rem 0 0.5rem; }
        .prose p  { color:#374151; line-height:1.8; margin:0 0 1rem; }
        .prose ul { padding-left:1.5rem; margin:0.75rem 0 1rem; }
        .prose ol { padding-left:1.5rem; margin:0.75rem 0 1rem; }
        .prose li { color:#374151; line-height:1.75; margin-bottom:0.4rem; }
        .prose a  { color:#7c3aed; font-weight:600; text-decoration:underline; text-underline-offset:3px; }
        .prose a:hover { color:#db2777; }
        .prose strong { color:#111827; font-weight:700; }
        .prose em { font-style:italic; color:#6b7280; }
        .prose blockquote {
          border-left:3px solid #e9d5ff; padding:12px 20px;
          background:#faf5ff; border-radius:0 12px 12px 0;
          margin:1.25rem 0; color:#6b7280; font-style:italic;
        }
        .prose code {
          background:#f3f4f6; color:#7c3aed; font-size:0.85em;
          padding:2px 6px; border-radius:4px; font-family:monospace;
        }
        .prose table { width:100%; border-collapse:collapse; margin:1.25rem 0; font-size:0.9rem; }
        .prose th { background:#f5f3ff; color:#7c3aed; font-weight:700; padding:10px 14px; text-align:left; border:1px solid #ede9fe; }
        .prose td { padding:9px 14px; border:1px solid #f3f4f6; color:#374151; }
        .prose tr:nth-child(even) td { background:#fafafa; }
        .prose hr { border:none; border-top:1px solid #f3f4f6; margin:2rem 0; }
      `}</style>

      <div style={{ minHeight:"100vh", background:"#fff" }}>

        {/* ── Breadcrumb + Başlık hero ── */}
        <div style={{
          background:"linear-gradient(145deg,#06000f 0%,#0d0120 60%,#080014 100%)",
          padding:"48px 24px 56px", position:"relative", overflow:"hidden",
        }}>
          <div style={{
            position:"absolute", top:"20%", left:"15%", width:320, height:320,
            borderRadius:"50%", background:"radial-gradient(circle,rgba(109,40,217,0.2) 0%,transparent 65%)",
            filter:"blur(50px)", pointerEvents:"none",
          }}/>
          <div style={{
            position:"absolute", bottom:"5%", right:"10%", width:240, height:240,
            borderRadius:"50%", background:"radial-gradient(circle,rgba(219,39,119,0.15) 0%,transparent 65%)",
            filter:"blur(50px)", pointerEvents:"none",
          }}/>

          <div style={{ maxWidth:760, margin:"0 auto", position:"relative", zIndex:1 }}>
            {/* Breadcrumb */}
            <nav style={{ display:"flex", alignItems:"center", gap:8, marginBottom:28 }}>
              <Link href="/" style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textDecoration:"none" }}>Ana Sayfa</Link>
              <span style={{ color:"rgba(255,255,255,0.2)", fontSize:12 }}>›</span>
              <Link href="/blog" style={{ fontSize:12, color:"rgba(255,255,255,0.4)", textDecoration:"none" }}>Blog</Link>
              <span style={{ color:"rgba(255,255,255,0.2)", fontSize:12 }}>›</span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.6)" }}>{post.category}</span>
            </nav>

            {/* Kategori + süre */}
            <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:20 }}>
              <span style={{
                background: cat.bg, color: cat.text,
                fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:999,
                border:`1px solid ${cat.text}30`,
              }}>
                {post.category}
              </span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>
                {post.readTime} okuma
              </span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>·</span>
              <span style={{ fontSize:12, color:"rgba(255,255,255,0.4)" }}>
                {formatDate(post.date)}
              </span>
            </div>

            <h1 style={{
              fontFamily:"var(--font-cormorant),serif",
              fontSize:"clamp(26px,4vw,42px)", fontWeight:700,
              color:"#fff", lineHeight:1.25, marginBottom:16,
            }}>
              {post.title}
            </h1>
            <p style={{ fontSize:16, color:"rgba(255,255,255,0.5)", lineHeight:1.6, maxWidth:580 }}>
              {post.description}
            </p>
          </div>
        </div>

        {/* ── İçerik ── */}
        <div style={{ maxWidth:760, margin:"0 auto", padding:"48px 24px 80px" }}>
          <article
            className="prose"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags */}
          {post.tags.length > 0 && (
            <div style={{ display:"flex", flexWrap:"wrap", gap:8, marginTop:40, paddingTop:32, borderTop:"1px solid #f3f4f6" }}>
              {post.tags.map(tag => (
                <span key={tag} style={{
                  background:"#f9fafb", border:"1px solid #e5e7eb",
                  color:"#6b7280", fontSize:12, padding:"4px 12px", borderRadius:999,
                }}>
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* Geri ve CTA */}
          <div style={{
            marginTop:56, display:"flex", flexDirection:"column", alignItems:"center", gap:16,
            background:"linear-gradient(135deg,#f5f3ff 0%,#fdf2f8 100%)",
            border:"1px solid rgba(124,58,237,0.12)",
            borderRadius:24, padding:"40px 32px", textAlign:"center",
          }}>
            <p style={{ fontWeight:800, fontSize:20, color:"#111827", margin:0 }}>
              Davetiyenizi hemen oluşturun
            </p>
            <p style={{ fontSize:14, color:"#6b7280", margin:0, lineHeight:1.6 }}>
              Dakikalar içinde şık dijital davetiye hazırlayın, WhatsApp ile paylaşın.
            </p>
            <div style={{ display:"flex", gap:12, flexWrap:"wrap", justifyContent:"center" }}>
              <Link href="/sablonlar" style={{
                background:"linear-gradient(135deg,#7C3AED,#DB2777)",
                color:"#fff", fontWeight:700, fontSize:14,
                padding:"12px 24px", borderRadius:12, textDecoration:"none",
              }}>
                Şablonlara Gözat →
              </Link>
              <Link href="/blog" style={{
                background:"#fff", color:"#6b7280", fontWeight:600, fontSize:14,
                padding:"12px 24px", borderRadius:12, textDecoration:"none",
                border:"1px solid #e5e7eb",
              }}>
                ← Tüm Yazılar
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
