"use client";

import React from "react";
import { cn } from "@/lib/utils";

export interface AppleSpinnerProps {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | number;
  color?: string;
  message?: string;
  className?: string;
  fullScreen?: boolean;
}

const SIZE_MAP: Record<string, number> = {
  xs: 16,
  sm: 20,
  md: 28,
  lg: 40,
  xl: 56,
};

/**
 * Authentic Apple-style Activity Indicator Spinner
 * Renders 12 radial rounded tick blades with stepped rotation in FifthLab brand cyan (#0090AD)
 */
export default function AppleSpinner({
  size = "md",
  color = "#0090AD",
  message,
  className,
  fullScreen = false,
}: AppleSpinnerProps) {
  const pixelSize = typeof size === "number" ? size : SIZE_MAP[size] || 28;

  // 12 blades with decreasing opacity from 1.0 to 0.12
  const blades = Array.from({ length: 12 }, (_, i) => ({
    rotation: i * 30,
    opacity: Math.max(0.12, 1 - (i * 0.08)),
  }));

  const spinner = (
    <div
      className={cn("inline-flex flex-col items-center justify-center select-none font-sans", className)}
      role="status"
      aria-label={message || "Loading"}
    >
      <div
        className="relative animate-spin"
        style={{
          width: pixelSize,
          height: pixelSize,
          animationTimingFunction: "steps(12, end)",
          animationDuration: "1s",
        }}
      >
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          {blades.map((blade, idx) => (
            <rect
              key={idx}
              x="46.5"
              y="5"
              width="7"
              height="24"
              rx="3.5"
              ry="3.5"
              fill={color}
              opacity={blade.opacity}
              transform={`rotate(${blade.rotation} 50 50)`}
            />
          ))}
        </svg>
      </div>

      {message && (
        <p className="mt-3 text-xs font-semibold text-slate-700 tracking-tight">
          {message}
        </p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/90 backdrop-blur-xs p-6">
        {spinner}
      </div>
    );
  }

  return spinner;
}
