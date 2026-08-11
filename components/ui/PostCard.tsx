import Link from "next/link";
import Image from "next/image";
import { MessageCircle } from "lucide-react";
import { C } from "@/lib/theme";
import { Avatar } from "@/components/ui/Avatar";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { LikeButton } from "@/components/ui/LikeButton";

export type PostCardData = {
  id: string;
  category: string;
  title: string | null;
  body: string;
  createdAt: string;
  author: { id: string; name: string };
  images: { id: string; url: string }[];
  likeCount: number;
  commentCount: number;
  likedByMe: boolean;
};

export function PostCard({ post, timeLabel }: { post: PostCardData; timeLabel: string }) {
  const cover = post.images[0];

  return (
    <article style={{ borderBottom: `1px solid ${C.border}` }}>
      <Link
        href={`/feed/${post.id}`}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 14px",
        }}
      >
        <Avatar name={post.author.name} size={32} />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span
              style={{
                fontSize: 13,
                fontWeight: 700,
                color: C.text,
                fontFamily: "var(--font-almarai), sans-serif",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {post.author.name}
            </span>
            <span style={{ color: C.textDim, fontSize: 11 }}>· {timeLabel}</span>
          </div>
        </div>
        <TypeBadge category={post.category} />
      </Link>

      {cover && (
        <Link
          href={`/feed/${post.id}`}
          style={{ display: "block", position: "relative", width: "100%", paddingTop: "100%", background: C.surface2 }}
        >
          <Image
            src={cover.url}
            alt=""
            fill
            sizes="480px"
            style={{ objectFit: "cover" }}
          />
          {post.images.length > 1 && (
            <span
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                background: "rgba(0,0,0,0.55)",
                color: "#fff",
                fontSize: 11,
                fontWeight: 700,
                padding: "3px 8px",
                borderRadius: 999,
              }}
            >
              +{post.images.length - 1}
            </span>
          )}
        </Link>
      )}

      <div style={{ padding: "8px 14px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 8, marginTop: cover ? 6 : 0 }}>
          <LikeButton
            postId={post.id}
            initialLiked={post.likedByMe}
            initialCount={post.likeCount}
            stopPropagation
          />
          <Link href={`/feed/${post.id}`} style={{ display: "flex", alignItems: "center", gap: 5, color: C.textDim, fontSize: 12.5 }}>
            <MessageCircle size={20} strokeWidth={1.8} /> {post.commentCount}
          </Link>
        </div>

        {post.title && (
          <div
            style={{
              fontSize: 13.5,
              fontWeight: 700,
              color: C.text,
              marginBottom: 3,
              fontFamily: "var(--font-almarai), sans-serif",
            }}
          >
            {post.title}
          </div>
        )}
        <div style={{ fontSize: 13, color: C.text, lineHeight: 1.6 }}>
          <span style={{ fontWeight: 700, fontFamily: "var(--font-almarai), sans-serif" }}>{post.author.name}</span>{" "}
          <span style={{ color: C.textDim }}>{post.body}</span>
        </div>

        {post.commentCount > 0 && (
          <Link href={`/feed/${post.id}`} style={{ display: "block", fontSize: 12.5, color: C.textDim, marginTop: 4 }}>
            عرض كل التعليقات ({post.commentCount})
          </Link>
        )}
      </div>
    </article>
  );
}
