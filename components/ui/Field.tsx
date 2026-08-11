"use client";

import { forwardRef } from "react";
import type { LucideIcon } from "lucide-react";
import { C } from "@/lib/theme";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: LucideIcon;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { icon: Icon, style, ...inputProps },
  ref
) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: C.surface2,
        border: `1px solid ${C.border}`,
        borderRadius: 11,
        padding: "12px 13px",
        marginBottom: 12,
      }}
    >
      <Icon size={15} color={C.textDim} />
      <input
        ref={ref}
        {...inputProps}
        style={{
          background: "none",
          border: "none",
          outline: "none",
          color: C.text,
          fontSize: 13.5,
          width: "100%",
          fontFamily: "var(--font-ibm-plex), sans-serif",
          ...style,
        }}
      />
    </div>
  );
});
