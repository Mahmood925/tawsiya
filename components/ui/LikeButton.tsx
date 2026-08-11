"use client";

import { useState, useTransition } from "react";
import { Heart } from "lucide-react";
import { C } from "@/lib/theme";

export function LikeButton({
  postId,
  initialLiked,
  initialCount,
  size = 15,
  stopPropagation,
}: {
  postId: string;
  initialLiked: boolean;
  initialCount: number;
  size?: number;
  stopPropagation?: boolean;
}) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  async function toggle(e: React.MouseEvent) {
    if (stopPropagation) e.stopPropagation();
    const nextLiked = !liked;
    setLiked(nextLiked);
    setCount((c) => c + (nextLiked ? 1 : -1));
    startTransition(async () => {
      const res = await fetch(`/api/posts/${postId}/like`, { method: "POST" });
      if (!res.ok) {
        setLiked(!nextLiked);
        setCount((c) => c + (nextLiked ? -1 : 1));
      }
    });
  }

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={isPending}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 5,
        background: "none",
        border: "none",
        cursor: "pointer",
        color: liked ? C.coral : C.textDim,
        fontSize: 12.5,
        fontFamily: "var(--font-ibm-plex), sans-serif",
      }}
    >
      <Heart size={size} fill={liked ? C.coral : "none"} /> {count}
    </button>
  );
}
