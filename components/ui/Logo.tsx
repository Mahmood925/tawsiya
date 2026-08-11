import { C } from "@/lib/theme";

export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: C.goldSoft,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.56} height={size * 0.56} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2.5 L20 6 V12 C20 17 16.5 20.5 12 21.5 C7.5 20.5 4 17 4 12 V6 Z"
          stroke={C.gold}
          strokeWidth={1.6}
          strokeLinejoin="round"
        />
        <path
          d="M8.3 12.2 L10.8 14.7 L15.7 9.3"
          stroke={C.gold}
          strokeWidth={1.8}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

export function Wordmark({ size = 19 }: { size?: number }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-almarai), sans-serif",
        fontWeight: 800,
        fontSize: size,
        color: C.text,
        letterSpacing: "-0.01em",
      }}
    >
      توصية
    </span>
  );
}

export function LogoLockup({ mark = 36, word = 19, gap = 10 }: { mark?: number; word?: number; gap?: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap }}>
      <LogoMark size={mark} />
      <Wordmark size={word} />
    </div>
  );
}
