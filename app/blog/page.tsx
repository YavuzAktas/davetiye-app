import Link from "next/link";
import { getAllPosts, formatDate } from "@/lib/blog";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  "Rehber":  { bg: "rgba(124,58,237,0.15)", text: "#a78bfa" },
  "İpucu":   { bg: "rgba(236,72,153,0.15)", text: "#f472b6" },
  "İlham":   { bg: "rgba(245,158,11,0.15)", text: "#fbbf24" },
};

export default function BlogPage() {
  const posts     = getAllPosts();
  const featured  = posts.find(p => p.featured);
  const rest       = posts.filter(p => !p.featured);

  return (
    <div style={{ minHeight: "100vh", background: "#fff" }}>

      {/* ── Hero ── */}
      <section style={{
        background: "linear-gradient(145deg,#06000f 0%,#0d0120 60%,#080014 100%)",
        padding: "80px 24px 64px",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position:"absolute", top:"20%", left:"20%", width:400, height:400,
          borderRadius:"50%", background:"radial-gradient(circle,rgba(109,40,217,0.25) 0%,transparent 65%)",
          filter:"blur(60px)", pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute", bottom:"10%", right:"15%", width:300, height:300,
          borderRadius:"50%", background:"radial-gradient(circle,rgba(219,39,119,0.2) 0%,transparent 65%)",
          filter:"blur(60px)", pointerEvents:"none",
        }}/>
        <div style={{
          position:"absolute", inset:0, opacity:0.03,
          backgroundImage:"radial-gradient(circle,#fff 1px,transparent 1px)",
          backgroundSize:"32px 32px", pointerEvents:"none",
        }}/>

        <div style={{ maxWidth:720, margin:"0 auto", textAlign:"center", position:"relative", zIndex:1 }}>
          <div style={{
            display:"inline-flex", alignItems:"center", gap:8,
            border:"1px solid rgba(168,85,247,0.3)", background:"rgba(168,85,247,0.1)",
            color:"rgba(196,132,252,0.9)", fontSize:11, fontWeight:600,
            padding:"6px 16px", borderRadius:999, marginBottom:24, letterSpacing:"0.12em",
          }}>
            ✦ BLOG & REHBER
          </div>
          <h1 style={{
            fontFamily:"var(--font-dancing),cursive",
            fontSize:"clamp(40px,6vw,64px)", color:"#fff", lineHeight:1.1, marginBottom:16,
          }}>
            Davetiye Dünyası
          </h1>
          <p style={{ fontSize:16, color:"rgba(255,255,255,0.5)", lineHeight:1.7, maxWidth:520, margin:"0 auto" }}>
            Dijital davetiye rehberleri, düğün ipuçları ve ilham verici içerikler — tümü burada.
          </p>
        </div>
      </section>

      <div style={{ maxWidth:900, margin:"0 auto", padding:"60px 24px" }}>

        {/* ── Öne Çıkan Yazı ── */}
        {featured && (
          <div style={{ marginBottom:56 }}>
            <p style={{
              fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase",
              color:"rgba(124,58,237,0.7)", fontWeight:700, marginBottom:16,
            }}>
              ✦ Öne Çıkan Yazı
            </p>
            <Link href={`/blog/${featured.slug}`} style={{ textDecoration:"none" }}>
              <div style={{
                background:"linear-gradient(135deg,#f5f3ff 0%,#fdf2f8 100%)",
                border:"1px solid rgba(124,58,237,0.15)",
                borderRadius:24, padding:"36px 40px",
                transition:"transform 0.2s, box-shadow 0.2s",
                cursor:"pointer",
                display:"block",
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "0 16px 48px rgba(124,58,237,0.12)";
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLElement).style.boxShadow = "none";
                }}
              >
                <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
                  <span style={{
                    background: CATEGORY_COLORS[featured.category]?.bg ?? "rgba(124,58,237,0.1)",
                    color:      CATEGORY_COLORS[featured.category]?.text ?? "#a78bfa",
                    fontSize:11, fontWeight:700, padding:"4px 12px", borderRadius:999,
                  }}>
                    {featured.category}
                  </span>
                  <span style={{ fontSize:12, color:"#9ca3af" }}>{featured.readTime} okuma</span>
                </div>
                <h2 style={{
                  fontSize:"clamp(20px,3vw,26px)", fontWeight:800, color:"#111827",
                  lineHeight:1.3, marginBottom:12,
                }}>
                  {featured.title}
                </h2>
                <p style={{ fontSize:15, color:"#6b7280", lineHeight:1.6, marginBottom:20 }}>
                  {featured.description}
                </p>
                <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between" }}>
                  <span style={{ fontSize:13, color:"#9ca3af" }}>{formatDate(featured.date)}</span>
                  <span style={{
                    display:"inline-flex", alignItems:"center", gap:6,
                    color:"#7c3aed", fontSize:13, fontWeight:700,
                  }}>
                    Okumaya devam et →
                  </span>
                </div>
              </div>
            </Link>
          </div>
        )}

        {/* ── Diğer Yazılar ── */}
        {rest.length > 0 && (
          <>
            <p style={{
              fontSize:10, letterSpacing:"0.2em", textTransform:"uppercase",
              color:"rgba(124,58,237,0.7)", fontWeight:700, marginBottom:24,
            }}>
              ✦ Tüm Yazılar
            </p>
            <div style={{
              display:"grid",
              gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",
              gap:24,
            }}>
              {rest.map(post => (
                <Link key={post.slug} href={`/blog/${post.slug}`} style={{ textDecoration:"none" }}>
                  <div style={{
                    background:"#fff", border:"1px solid #f3f4f6",
                    borderRadius:20, padding:"28px 28px 24px",
                    height:"100%", transition:"transform 0.2s, box-shadow 0.2s",
                    cursor:"pointer",
                  }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(-3px)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "0 12px 32px rgba(0,0,0,0.08)";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLElement).style.transform = "translateY(0)";
                      (e.currentTarget as HTMLElement).style.boxShadow = "none";
                    }}
                  >
                    <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:14 }}>
                      <span style={{
                        background: CATEGORY_COLORS[post.category]?.bg ?? "rgba(124,58,237,0.1)",
                        color:      CATEGORY_COLORS[post.category]?.text ?? "#a78bfa",
                        fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:999,
                      }}>
                        {post.category}
                      </span>
                      <span style={{ fontSize:11, color:"#d1d5db" }}>·</span>
                      <span style={{ fontSize:11, color:"#9ca3af" }}>{post.readTime}</span>
                    </div>
                    <h2 style={{
                      fontSize:17, fontWeight:700, color:"#111827",
                      lineHeight:1.4, marginBottom:10,
                    }}>
                      {post.title}
                    </h2>
                    <p style={{
                      fontSize:13, color:"#6b7280", lineHeight:1.6, marginBottom:18,
                      display:"-webkit-box", WebkitLineClamp:3, WebkitBoxOrient:"vertical", overflow:"hidden",
                    } as React.CSSProperties}>
                      {post.description}
                    </p>
                    <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
                      <span style={{ fontSize:12, color:"#9ca3af" }}>{formatDate(post.date)}</span>
                      <span style={{ fontSize:12, color:"#7c3aed", fontWeight:600 }}>Oku →</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </>
        )}

        {/* ── CTA ── */}
        <div style={{
          marginTop:64, borderRadius:24, padding:"48px 40px", textAlign:"center",
          background:"linear-gradient(135deg,#f5f3ff 0%,#fdf2f8 100%)",
          border:"1px solid rgba(124,58,237,0.1)",
        }}>
          <h3 style={{ fontSize:24, fontWeight:800, color:"#111827", marginBottom:10 }}>
            Davetiyenizi hemen oluşturun
          </h3>
          <p style={{ fontSize:14, color:"#6b7280", marginBottom:28, lineHeight:1.6 }}>
            Dakikalar içinde şık dijital davetiye hazırlayın, WhatsApp ile paylaşın.
          </p>
          <Link href="/sablonlar" style={{
            display:"inline-flex", alignItems:"center", gap:8,
            background:"linear-gradient(135deg,#7C3AED,#DB2777)",
            color:"#fff", fontWeight:700, fontSize:14,
            padding:"13px 28px", borderRadius:14, textDecoration:"none",
          }}>
            Şablonlara Gözat →
          </Link>
        </div>
      </div>
    </div>
  );
}
