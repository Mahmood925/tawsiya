const NAVY = "#0B1F3A";
const GOLD = "#D4A72C";
const EMERALD = "#17A567";

export function LogoMark({ size = 36, white = false }: { size?: number; white?: boolean }) {
  const stroke = white ? "#FFFFFF" : GOLD;
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: size * 0.28,
        background: `linear-gradient(160deg, ${NAVY} 0%, #081527 100%)`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      <svg width={size * 0.62} height={size * 0.62} viewBox="0 0 58 58" fill="none">
        <path
          d="M8 42 L20 34 L30 40 L46 16"
          stroke={stroke}
          strokeWidth={4.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path d="M38 16 H46 V24" stroke={stroke} strokeWidth={4.5} strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="20" cy="34" r="3.4" fill={EMERALD} />
        <circle cx="30" cy="40" r="3.4" fill={white ? NAVY : "#F8F6F0"} />
        <circle cx="8" cy="42" r="3.4" fill={EMERALD} />
      </svg>
    </div>
  );
}

export function Wordmark({ size = 19, onDark = false }: { size?: number; onDark?: boolean }) {
  return (
    <span
      style={{
        fontFamily: "var(--font-almarai), sans-serif",
        fontWeight: 800,
        fontSize: size,
        color: onDark ? "#F8F6F0" : NAVY,
        letterSpacing: "-0.01em",
      }}
    >
      تو<span style={{ color: GOLD }}>صي</span>ة
    </span>
  );
}

export function LogoLockup({
  mark = 36,
  word = 19,
  gap = 10,
  onDark = false,
}: {
  mark?: number;
  word?: number;
  gap?: number;
  onDark?: boolean;
}) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap }}>
      <LogoMark size={mark} />
      <Wordmark size={word} onDark={onDark} />
    </div>
  );
}
