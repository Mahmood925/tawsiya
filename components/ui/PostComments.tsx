"use client";

import { useState } from "react";
import { Send, MessageCircle } from "lucide-react";
import { C } from "@/lib/theme";
import { EmptyState } from "@/components/ui/EmptyState";

type CommentItem = {
  id: string;
  text: string;
  user: { id: string; name: string };
};

export function PostComments({
  postId,
  authorId,
  initialComments,
  myName,
}: {
  postId: string;
  authorId: string;
  initialComments: CommentItem[];
  myName: string;
}) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [text, setText] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function send() {
    const value = text.trim();
    if (!value || submitting) return;
    setText("");
    setSubmitting(true);

    const tempId = `temp-${Date.now()}`;
    const optimistic: CommentItem = { id: tempId, text: value, user: { id: "me", name: myName } };
    setComments((prev) => [...prev, optimistic]);

    const res = await fetch(`/api/posts/${postId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: value }),
    });

    setSubmitting(false);

    if (!res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== tempId));
      return;
    }

    const data = await res.json();
    setComments((prev) => prev.map((c) => (c.id === tempId ? data.comment : c)));
  }

  return (
    <>
      <div style={{ padding: "0 14px", display: "flex", flexDirection: "column", gap: 10, marginBottom: 90 }}>
        {comments.map((c) => (
          <div key={c.id} style={{ fontSize: 13, lineHeight: 1.6 }}>
            <span
              style={{
                fontWeight: 700,
                color: c.user.id === authorId ? C.gold : C.text,
                fontFamily: "var(--font-almarai), sans-serif",
              }}
            >
              {c.user.name}
            </span>{" "}
            <span style={{ color: C.text }}>{c.text}</span>
          </div>
        ))}
        {comments.length === 0 && <EmptyState icon={MessageCircle} title="لا توجد تعليقات بعد" hint="كن أول من يعلّق على هذا المنشور" />}
      </div>

      <div
        style={{
          position: "sticky",
          bottom: 0,
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          padding: 10,
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              send();
            }
          }}
          placeholder="اكتب تعليقاً..."
          style={{
            flex: 1,
            background: C.surface2,
            border: `1px solid ${C.border}`,
            borderRadius: 20,
            padding: "10px 14px",
            color: C.text,
            fontSize: 13,
            outline: "none",
            fontFamily: "var(--font-ibm-plex), sans-serif",
          }}
        />
        <button
          type="button"
          onClick={send}
          disabled={submitting || !text.trim()}
          style={{
            width: 40,
            height: 40,
            borderRadius: "50%",
            border: "none",
            cursor: "pointer",
            background: text.trim() ? C.gold : C.surface2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
          }}
        >
          <Send size={16} color={text.trim() ? "#1A1206" : C.textDim} />
        </button>
      </div>
    </>
  );
}
