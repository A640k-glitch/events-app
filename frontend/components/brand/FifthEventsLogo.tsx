"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LogoProps {
  className?: string;
  size?: number | string;
  variant?: "full" | "icon" | "stacked" | "monochrome";
  theme?: "light" | "dark" | "teal" | "mono";
  showSubtitle?: boolean;
}

/**
 * FifthEvents Official Vector Emblem
 * Clean, razor-sharp geometric mark engineered to match Finedge, Bulkwave & UCP:
 * - Top Teal Capsule: #26B5BA
 * - Middle Indigo Ribbon: #2B237C
 * - Lower Mint/Aqua Base: #2DD4BF
 * - Crisp negative space, perfectly aligned coordinates for sub-pixel clarity at 20px-120px.
 */
export function FifthEventsEmblem({
  size = 32,
  className,
  monochrome = false,
}: {
  size?: number | string;
  className?: string;
  monochrome?: boolean;
}) {
  if (monochrome) {
    return (
      <svg
        width={size}
        height={size}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn("shrink-0 select-none", className)}
      >
        {/* Vertical Anchor Stem */}
        <rect x="6" y="8" width="7" height="32" rx="3.5" fill="currentColor" />
        {/* Top F Bar */}
        <rect x="16" y="8" width="24" height="7" rx="3.5" fill="currentColor" />
        {/* Middle FE Crossbar */}
        <rect x="16" y="20" width="18" height="7" rx="3.5" fill="currentColor" opacity="0.8" />
        {/* Bottom E Base */}
        <rect x="16" y="33" width="22" height="7" rx="3.5" fill="currentColor" opacity="0.6" />
      </svg>
    );
  }

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn("shrink-0 select-none", className)}
    >
      {/* 1. Left Vertical Pillar (Deep Navy/Indigo) */}
      <rect x="6" y="8" width="7.5" height="32" rx="3.75" fill="#1C1852" />

      {/* 2. Top "F" Horizontal Wing (Vibrant Finedge Teal #26B5BA) */}
      <path
        d="M14 8H38C41.866 8 45 11.134 45 15C45 18.866 41.866 22 38 22H14V8Z"
        fill="#26B5BA"
      />

      {/* 3. Middle Intersecting Crossbar (Deep Royal Indigo #382C84) */}
      <path
        d="M14 20H32C35.3137 20 38 22.6863 38 26C38 29.3137 35.3137 32 32 32H14V20Z"
        fill="#382C84"
      />

      {/* 4. Lower "E" Foundation Wing (Fresh Aqua/Mint #2DD4BF) */}
      <path
        d="M14 33H35C38.866 33 42 36.134 42 40C42 43.866 38.866 47 35 47H14V33Z"
        fill="#2DD4BF"
      />

      {/* 5. Modern Event Broadcast Dot (Accent Dot) */}
      <circle cx="9.75" cy="43" r="3.75" fill="#7BC043" />
    </svg>
  );
}

export default function FifthEventsLogo({
  className,
  size = 32,
  variant = "full",
  theme = "light",
  showSubtitle = true,
}: LogoProps) {
  const isMono = theme === "mono" || variant === "monochrome";

  if (variant === "icon") {
    return <FifthEventsEmblem size={size} className={className} monochrome={isMono} />;
  }

  if (variant === "stacked") {
    return (
      <div className={cn("inline-flex flex-col items-center text-center gap-2 select-none", className)}>
        <FifthEventsEmblem size={typeof size === "number" ? size * 1.3 : size} monochrome={isMono} />
        <div className="flex flex-col items-center leading-none">
          <span
            className={cn(
              "font-bold text-[19px] tracking-tight font-sans",
              theme === "dark" ? "text-white" : "text-[#111827]"
            )}
          >
            FifthEvents
          </span>
          {showSubtitle && (
            <span className="text-[9px] uppercase font-mono tracking-widest text-[#8E8EA0] font-semibold mt-1">
              A FIFTHLAB PRODUCT
            </span>
          )}
        </div>
      </div>
    );
  }

  // Default horizontal layout (matches Finedge & FifthLab product presentation)
  return (
    <div className={cn("inline-flex items-center gap-3 select-none", className)}>
      <FifthEventsEmblem size={size} monochrome={isMono} />

      <div className="flex flex-col text-left leading-none justify-center">
        <span
          className={cn(
            "font-bold text-[19px] tracking-tight font-sans",
            theme === "dark" ? "text-white" : "text-[#111827]"
          )}
        >
          FifthEvents
        </span>
        {showSubtitle && (
          <span
            className={cn(
              "text-[9px] uppercase font-sans font-semibold tracking-wider mt-1",
              theme === "dark" ? "text-[#A3A3B2]" : "text-[#7C7C7C]"
            )}
          >
            A FIFTHLAB PRODUCT
          </span>
        )}
      </div>
    </div>
  );
}
