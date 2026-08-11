import { C } from "@/lib/theme";

export function GoldPulseDot({ size = 8 }: { size?: number }) {
  return (
    <span style={{ position: "relative", width: size, height: size, display: "inline-block" }}>
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: C.gold,
          opacity: 0.55,
          animation: "pulseRing 1.8s ease-out infinite",
        }}
      />
      <span
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: C.gold,
        }}
      />
    </span>
  );
}
