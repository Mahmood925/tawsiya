"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ImagePlus, X } from "lucide-react";
import { C } from "@/lib/theme";
import { GoldButton } from "@/components/ui/GoldButton";

export function NewPostForm() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [category, setCategory] = useState("analysis");
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function onFilesSelected(files: FileList | null) {
    if (!files) return;
    setImages((prev) => [...prev, ...Array.from(files)].slice(0, 4));
  }

  function removeImage(index: number) {
    setImages((prev) => prev.filter((_, i) => i !== index));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!body.trim()) {
      setError("نص المنشور مطلوب");
      return;
    }
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.set("category", category);
    if (title.trim()) formData.set("title", title.trim());
    formData.set("body", body.trim());
    images.forEach((file) => formData.append("images", file));

    const res = await fetch("/api/posts", { method: "POST", body: formData });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.error || "حدث خطأ أثناء النشر");
      return;
    }
    router.push(`/feed/${data.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={submit} style={{ padding: 16 }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {[
          { key: "analysis", label: "تحليل" },
          { key: "news", label: "خبر" },
        ].map((opt) => (
          <button
            key={opt.key}
            type="button"
            onClick={() => setCategory(opt.key)}
            style={{
              padding: "8px 16px",
              borderRadius: 999,
              fontSize: 12.5,
              fontWeight: 600,
              border: `1px solid ${category === opt.key ? C.gold : C.border}`,
              background: category === opt.key ? C.goldSoft : "transparent",
              color: category === opt.key ? C.gold : C.textDim,
              cursor: "pointer",
            }}
          >
            {opt.label}
          </button>
        ))}
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="عنوان (اختياري)"
        style={{
          width: "100%",
          background: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: 11,
          padding: "12px 13px",
          marginBottom: 12,
          color: C.text,
          fontSize: 13.5,
          fontFamily: "var(--font-almarai), sans-serif",
          outline: "none",
        }}
      />

      <textarea
        value={body}
        onChange={(e) => setBody(e.target.value)}
        placeholder="اكتب نص المنشور..."
        rows={6}
        style={{
          width: "100%",
          background: C.surface2,
          border: `1px solid ${C.border}`,
          borderRadius: 11,
          padding: "12px 13px",
          marginBottom: 12,
          color: C.text,
          fontSize: 13.5,
          fontFamily: "var(--font-ibm-plex), sans-serif",
          outline: "none",
          resize: "vertical",
        }}
      />

      <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 12 }}>
        {images.map((file, i) => (
          <div key={i} style={{ position: "relative", width: 72, height: 72 }}>
            <img
              src={URL.createObjectURL(file)}
              alt=""
              style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 10, border: `1px solid ${C.border}` }}
            />
            <button
              type="button"
              onClick={() => removeImage(i)}
              style={{
                position: "absolute",
                top: -6,
                left: -6,
                width: 20,
                height: 20,
                borderRadius: "50%",
                background: C.coral,
                border: "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
              }}
            >
              <X size={12} color="#fff" />
            </button>
          </div>
        ))}
        {images.length < 4 && (
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            style={{
              width: 72,
              height: 72,
              borderRadius: 10,
              border: `1px dashed ${C.border}`,
              background: "none",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              cursor: "pointer",
              color: C.textDim,
            }}
          >
            <ImagePlus size={20} />
          </button>
        )}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          hidden
          onChange={(e) => onFilesSelected(e.target.files)}
        />
      </div>

      {error && <div style={{ color: C.coral, fontSize: 12.5, marginBottom: 12 }}>{error}</div>}

      <GoldButton type="submit" disabled={loading}>
        {loading ? "جارٍ النشر..." : "نشر"}
      </GoldButton>
    </form>
  );
}
