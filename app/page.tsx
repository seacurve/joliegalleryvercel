// app/gallery/page.tsx  (Next.js App Router, server component fetch langsung ke Supabase)
// npm install @supabase/supabase-js

import { createClient } from "@supabase/supabase-js";

// pakai ANON key di sini (read-only, aman di client/server component publik)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

const PRIVATE_JOIN_LINK = "https://t.me/+xxxxxxxxxxxx"; // ganti sesuai link invite private
const FREE_CHANNEL_LINK = "https://t.me/+lR_yKpRL_A4xY2M1"; // link invite free channel

type Post = {
  id: string;
  is_locked: boolean;
  media_url: string | null;
  teaser_url: string | null;
  media_type: string;
  created_at: string;
};

async function getPosts(): Promise<Post[]> {
  const { data, error } = await supabase
    .from("posts")
    .select("id, is_locked, media_url, teaser_url, media_type, created_at")
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data ?? [];
}

export const revalidate = 60; // refresh tiap 60 detik, ganti sesuai kebutuhan

export default async function GalleryPage() {
  const posts = await getPosts();
  const freeCount = posts.filter((p) => !p.is_locked).length;
  const privateCount = posts.length - freeCount;

  return (
    <div style={{ background: "#0d0c0b", minHeight: "100vh", color: "#f3ede2" }}>
      <header style={{ textAlign: "center", padding: "56px 20px 28px", borderBottom: "1px solid #2a2621" }}>
        <div style={{ fontSize: 11, letterSpacing: "0.28em", color: "#c9a667", marginBottom: 14 }}>ARCHIVE</div>
        <h1 style={{ fontFamily: "Georgia, serif", fontSize: 40, margin: "0 0 16px" }}>Jolie</h1>
        <div style={{ display: "flex", justifyContent: "center", gap: 32, marginBottom: 22, fontSize: 13, color: "#9a9187" }}>
          <span><b style={{ color: "#f3ede2" }}>{posts.length}</b> Posts</span>
          <span><b style={{ color: "#f3ede2" }}>{freeCount}</b> Free</span>
          <span><b style={{ color: "#f3ede2" }}>{privateCount}</b> Private</span>
        </div>
        <a
          href={PRIVATE_JOIN_LINK}
          target="_blank"
          style={{ background: "#c9a667", color: "#1a1510", padding: "12px 26px", borderRadius: 999, fontWeight: 600, fontSize: 13, textDecoration: "none" }}
        >
          Join Jolie Privée
        </a>
      </header>

      <main style={{ maxWidth: 920, margin: "0 auto", padding: "36px 12px 100px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 4 }}>
          {posts.map((post) => (
            <a
              key={post.id}
              href={post.is_locked ? PRIVATE_JOIN_LINK : FREE_CHANNEL_LINK}
              target="_blank"
              rel="noopener"
              style={{
                position: "relative",
                aspectRatio: "4/5",
                display: "block",
                overflow: "hidden",
                background: "#161412",
                cursor: "pointer",
              }}
            >
              {/* teaser_url = blur asli dari server (bukan CSS blur doang, jadi gak bisa di-unblur pakai devtools) */}
              {post.is_locked ? (
                <img
                  src={post.teaser_url ?? ""}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              ) : post.media_type === "video" ? (
                <video
                  src={post.media_url ?? ""}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  autoPlay
                  muted
                  loop
                  playsInline
                  preload="metadata"
                />
              ) : (
                <img
                  src={post.media_url ?? ""}
                  alt=""
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              )}
              {post.is_locked && (
                <div
                  style={{
                    position: "absolute",
                    inset: 0,
                    background: "linear-gradient(180deg, rgba(13,12,11,.1), rgba(13,12,11,.7))",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 6,
                  }}
                >
                  <div style={{ width: 34, height: 34, borderRadius: "50%", border: "1px solid rgba(201,166,103,.6)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    🔒
                  </div>
                  <span style={{ fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "#e4c893" }}>
                    Unlock
                  </span>
                </div>
              )}
            </a>
          ))}
        </div>
      </main>
    </div>
  );
}
