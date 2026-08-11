import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { timeAgo } from "@/lib/posts";
import { C } from "@/lib/theme";
import { TopBar } from "@/components/ui/TopBar";
import { Avatar } from "@/components/ui/Avatar";
import { TypeBadge } from "@/components/ui/TypeBadge";
import { LikeButton } from "@/components/ui/LikeButton";
import { PostComments } from "@/components/ui/PostComments";

export default async function PostDetailPage({ params }: { params: { id: string } }) {
  const session = await getSession();
  if (!session) redirect("/login");

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      author: { select: { id: true, name: true } },
      images: true,
      comments: {
        orderBy: { createdAt: "asc" },
        include: { user: { select: { id: true, name: true } } },
      },
      _count: { select: { likes: true } },
      likes: { where: { userId: session.sub }, select: { id: true } },
    },
  });

  if (!post) notFound();

  return (
    <div style={{ display: "flex", flexDirection: "column", minHeight: "100%" }}>
      <TopBar title="المنشور" backHref="/feed" />

      <div style={{ display: "flex", alignItems: "center", gap: 9, padding: "10px 14px" }}>
        <Avatar name={post.author.name} size={32} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: C.text, fontFamily: "var(--font-almarai), sans-serif" }}>
            {post.author.name}
          </div>
          <div style={{ fontSize: 11, color: C.textDim }}>{timeAgo(post.createdAt.toISOString())}</div>
        </div>
        <TypeBadge category={post.category} />
      </div>

      {post.images.map((img) => (
        <div key={img.id} style={{ position: "relative", width: "100%", paddingTop: "100%", background: C.surface2 }}>
          <Image src={img.url} alt="" fill sizes="480px" style={{ objectFit: "cover" }} priority />
        </div>
      ))}

      <div style={{ padding: "10px 14px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
          <LikeButton postId={post.id} initialLiked={post.likes.length > 0} initialCount={post._count.likes} size={22} />
        </div>

        {post.title && (
          <div style={{ fontSize: 15, fontWeight: 800, color: C.text, marginBottom: 4, fontFamily: "var(--font-almarai), sans-serif" }}>
            {post.title}
          </div>
        )}
        <div style={{ fontSize: 13, lineHeight: 1.6, marginBottom: 4 }}>
          <span style={{ fontWeight: 700, color: C.text, fontFamily: "var(--font-almarai), sans-serif" }}>
            {post.author.name}
          </span>{" "}
          <span style={{ color: C.text }}>{post.body}</span>
        </div>
      </div>

      <PostComments
        postId={post.id}
        authorId={post.author.id}
        myName={session.name}
        initialComments={post.comments}
      />
    </div>
  );
}
