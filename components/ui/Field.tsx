"use client";

import { forwardRef, useState } from "react";
import type { LucideIcon } from "lucide-react";
import { C } from "@/lib/theme";

type FieldProps = React.InputHTMLAttributes<HTMLInputElement> & {
  icon: LucideIcon;
};

export const Field = forwardRef<HTMLInputElement, FieldProps>(function Field(
  { icon: Icon, style, onFocus, onBlur, ...inputProps },
  ref
) {
  const [focused, setFocused] = useState(false);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        background: focused ? C.surface : C.surface2,
        border: `1px solid ${focused ? C.gold : C.border}`,
        borderRadius: 11,
        padding: "12px 13px",
        marginBottom: 12,
        boxShadow: focused ? `0 0 0 3px ${C.goldSoft}` : "none",
        transition: "border-color .15s ease, box-shadow .15s ease, background .15s ease",
      }}
    >
      <Icon size={15} color={focused ? C.gold : C.textDim} />
      <input
        ref={ref}
        {...inputProps}
        onFocus={(e) => {
          setFocused(true);
          onFocus?.(e);
        }}
        onBlur={(e) => {
          setFocused(false);
          onBlur?.(e);
        }}
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
