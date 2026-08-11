"use client";

import { useEffect, useState, useCallback } from "react";
import { Check, X, Trash2, UserPlus } from "lucide-react";
import { C } from "@/lib/theme";
import { Avatar } from "@/components/ui/Avatar";
import { GoldButton } from "@/components/ui/GoldButton";

type AdminUser = {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  role: "USER" | "COACH" | "ADMIN";
  status: "PENDING" | "APPROVED" | "REJECTED";
  createdAt: string;
};

type AdminPost = {
  id: string;
  title: string | null;
  body: string;
  category: string;
  author: { name: string };
};

const TABS = [
  { key: "pending", label: "طلبات معلّقة" },
  { key: "users", label: "المستخدمون" },
  { key: "posts", label: "المنشورات" },
] as const;

const ROLE_LABEL: Record<string, string> = { USER: "متداول", COACH: "كوتش", ADMIN: "إدارة" };

export function AdminDashboard() {
  const [tab, setTab] = useState<(typeof TABS)[number]["key"]>("pending");
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [posts, setPosts] = useState<AdminPost[]>([]);
  const [loading, setLoading] = useState(false);

  const [showCreate, setShowCreate] = useState(false);
  const [createName, setCreateName] = useState("");
  const [createEmail, setCreateEmail] = useState("");
  const [createPassword, setCreatePassword] = useState("");
  const [createRole, setCreateRole] = useState("COACH");
  const [createError, setCreateError] = useState("");
  const [creating, setCreating] = useState(false);

  const loadUsers = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/admin/users");
    const data = await res.json();
    setUsers(data.users || []);
    setLoading(false);
  }, []);

  const loadPosts = useCallback(async () => {
    setLoading(true);
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data.posts || []);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (tab === "posts") loadPosts();
    else loadUsers();
  }, [tab, loadUsers, loadPosts]);

  async function act(userId: string, action: string, role?: string) {
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action, role }),
    });
    loadUsers();
  }

  async function deletePost(postId: string) {
    await fetch(`/api/posts/${postId}`, { method: "DELETE" });
    loadPosts();
  }

  async function createAccount(e: React.FormEvent) {
    e.preventDefault();
    setCreateError("");
    setCreating(true);
    const res = await fetch("/api/admin/users", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: createName, email: createEmail, password: createPassword, role: createRole }),
    });
    const data = await res.json();
    setCreating(false);
    if (!res.ok) {
      setCreateError(data.error || "حدث خطأ");
      return;
    }
    setCreateName("");
    setCreateEmail("");
    setCreatePassword("");
    setCreateRole("COACH");
    setShowCreate(false);
    loadUsers();
  }

  const pendingUsers = users.filter((u) => u.status === "PENDING");

  return (
    <div style={{ padding: "14px 16px" }}>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        {TABS.map((t) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            style={{
              padding: "7px 14px",
              borderRadius: 999,
              fontSize: 12.5,
              fontWeight: 600,
              border: `1px solid ${tab === t.key ? C.gold : C.border}`,
              background: tab === t.key ? C.goldSoft : "transparent",
              color: tab === t.key ? C.gold : C.textDim,
              cursor: "pointer",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading && <div style={{ color: C.textDim, fontSize: 12.5, textAlign: "center", padding: 20 }}>جارٍ التحميل...</div>}

      {!loading && tab === "pending" && (
        <div>
          {pendingUsers.length === 0 && (
            <div style={{ textAlign: "center", color: C.textDim, fontSize: 13, padding: "30px 0" }}>
              لا توجد طلبات معلّقة
            </div>
          )}
          {pendingUsers.map((u) => (
            <div
              key={u.id}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 13,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ display: "flex", gap: 10, alignItems: "center", marginBottom: 10 }}>
                <Avatar name={u.name} />
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text, fontFamily: "var(--font-almarai), sans-serif" }}>
                    {u.name}
                  </div>
                  <div style={{ fontSize: 11.5, color: C.textDim }}>{u.email}</div>
                </div>
              </div>
              <div style={{ display: "flex", gap: 8 }}>
                <button
                  onClick={() => act(u.id, "approve")}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    padding: "9px",
                    borderRadius: 9,
                    border: "none",
                    background: C.tealSoft,
                    color: C.teal,
                    fontWeight: 700,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  <Check size={14} /> قبول
                </button>
                <button
                  onClick={() => act(u.id, "reject")}
                  style={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 5,
                    padding: "9px",
                    borderRadius: 9,
                    border: "none",
                    background: C.coralSoft,
                    color: C.coral,
                    fontWeight: 700,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  <X size={14} /> رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "users" && (
        <div>
          {!showCreate && (
            <button
              onClick={() => setShowCreate(true)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                width: "100%",
                padding: "10px",
                borderRadius: 11,
                border: `1px dashed ${C.gold}`,
                background: C.goldSoft,
                color: C.gold,
                fontWeight: 700,
                fontSize: 12.5,
                cursor: "pointer",
                marginBottom: 12,
              }}
            >
              <UserPlus size={15} /> إنشاء حساب مباشرة
            </button>
          )}

          {showCreate && (
            <form
              onSubmit={createAccount}
              style={{
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 13,
                padding: 12,
                marginBottom: 14,
              }}
            >
              <input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                placeholder="الاسم الكامل"
                required
                style={{
                  width: "100%",
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  padding: "9px 12px",
                  marginBottom: 8,
                  color: C.text,
                  fontSize: 12.5,
                  outline: "none",
                }}
              />
              <input
                value={createEmail}
                onChange={(e) => setCreateEmail(e.target.value)}
                placeholder="البريد الإلكتروني"
                type="email"
                required
                style={{
                  width: "100%",
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  padding: "9px 12px",
                  marginBottom: 8,
                  color: C.text,
                  fontSize: 12.5,
                  outline: "none",
                }}
              />
              <input
                value={createPassword}
                onChange={(e) => setCreatePassword(e.target.value)}
                placeholder="كلمة المرور"
                type="text"
                required
                style={{
                  width: "100%",
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  padding: "9px 12px",
                  marginBottom: 8,
                  color: C.text,
                  fontSize: 12.5,
                  outline: "none",
                }}
              />
              <select
                value={createRole}
                onChange={(e) => setCreateRole(e.target.value)}
                style={{
                  width: "100%",
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: 9,
                  padding: "9px 12px",
                  marginBottom: 10,
                  color: C.text,
                  fontSize: 12.5,
                }}
              >
                {Object.entries(ROLE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>

              {createError && <div style={{ color: C.coral, fontSize: 12, marginBottom: 8 }}>{createError}</div>}

              <div style={{ display: "flex", gap: 8 }}>
                <div style={{ flex: 1 }}>
                  <GoldButton type="submit" disabled={creating}>
                    {creating ? "جارٍ الإنشاء..." : "إنشاء"}
                  </GoldButton>
                </div>
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  style={{
                    padding: "0 16px",
                    borderRadius: 11,
                    border: `1px solid ${C.border}`,
                    background: "none",
                    color: C.textDim,
                    fontSize: 12.5,
                    cursor: "pointer",
                  }}
                >
                  إلغاء
                </button>
              </div>
            </form>
          )}

          {users.map((u) => (
            <div
              key={u.id}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 13,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <Avatar name={u.name} />
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text, fontFamily: "var(--font-almarai), sans-serif" }}>
                  {u.name}
                </div>
                <div style={{ fontSize: 11, color: C.textDim }}>
                  {u.email} · {u.status === "APPROVED" ? "مفعّل" : u.status === "PENDING" ? "معلّق" : "مرفوض"}
                </div>
              </div>
              <select
                value={u.role}
                onChange={(e) => act(u.id, "setRole", e.target.value)}
                style={{
                  background: C.surface2,
                  border: `1px solid ${C.border}`,
                  borderRadius: 8,
                  color: C.text,
                  fontSize: 12,
                  padding: "6px 8px",
                }}
              >
                {Object.entries(ROLE_LABEL).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      {!loading && tab === "posts" && (
        <div>
          {posts.map((p) => (
            <div
              key={p.id}
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                background: C.surface,
                border: `1px solid ${C.border}`,
                borderRadius: 13,
                padding: 12,
                marginBottom: 10,
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: C.text, marginBottom: 3, fontFamily: "var(--font-almarai), sans-serif" }}>
                  {p.title || p.body.slice(0, 40)}
                </div>
                <div style={{ fontSize: 11.5, color: C.textDim }}>{p.author.name}</div>
              </div>
              <button
                onClick={() => deletePost(p.id)}
                style={{
                  width: 32,
                  height: 32,
                  borderRadius: 8,
                  border: "none",
                  background: C.coralSoft,
                  color: C.coral,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  flexShrink: 0,
                }}
              >
                <Trash2 size={14} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
