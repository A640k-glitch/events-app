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
        <rect x="4.5" y="4.5" width="7" height="32" rx="3.5" fill="currentColor" />
        {/* Top F Bar */}
        <rect x="14.5" y="4.5" width="24" height="7" rx="3.5" fill="currentColor" />
        {/* Middle FE Crossbar */}
        <rect x="14.5" y="16.5" width="18" height="7" rx="3.5" fill="currentColor" opacity="0.8" />
        {/* Bottom E Base */}
        <rect x="14.5" y="29.5" width="22" height="7" rx="3.5" fill="currentColor" opacity="0.6" />
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
      <rect x="4.5" y="4.5" width="7.5" height="32" rx="3.75" fill="#1C1852" />

      {/* 2. Top "F" Horizontal Wing (Vibrant Finedge Teal #26B5BA) */}
      <path
        d="M12.5 4.5H36.5C40.366 4.5 43.5 7.634 43.5 11.5C43.5 15.366 40.366 18.5 36.5 18.5H12.5V4.5Z"
        fill="#26B5BA"
      />

      {/* 3. Middle Intersecting Crossbar (Deep Royal Indigo #382C84) */}
      <path
        d="M12.5 16.5H30.5C33.8137 16.5 36.5 19.1863 36.5 22.5C36.5 25.8137 33.8137 28.5 30.5 28.5H12.5V16.5Z"
        fill="#382C84"
      />

      {/* 4. Lower "E" Foundation Wing (Fresh Aqua/Mint #2DD4BF) */}
      <path
        d="M12.5 29.5H33.5C37.366 29.5 40.5 32.634 40.5 36.5C40.5 40.366 37.366 43.5 33.5 43.5H12.5V29.5Z"
        fill="#2DD4BF"
      />

      {/* 5. Modern Event Broadcast Dot (Accent Dot) */}
      <circle cx="8.25" cy="39.5" r="3.75" fill="#7BC043" />
    </svg>
  );
}

export default function FifthEventsLogo({
  className,
  size = 32,
  variant = "full",
  theme = "light",
  showSubtitle = false,
}: LogoProps) {
  const isMono = theme === "mono" || variant === "monochrome";

  if (variant === "icon") {
    return <FifthEventsEmblem size={size} className={className} monochrome={isMono} />;
  }

  const numSize = typeof size === "number" ? size : 32;
  const titleStyle = numSize > 48 ? { fontSize: `${Math.round(numSize * 0.55)}px` } : undefined;
  const subStyle = numSize > 48 ? { fontSize: `${Math.round(numSize * 0.22)}px` } : undefined;

  if (variant === "stacked") {
    return (
      <div className={cn("inline-flex flex-col items-center text-center gap-2 select-none", className)}>
        <FifthEventsEmblem size={typeof size === "number" ? size * 1.3 : size} monochrome={isMono} />
        <div className="flex flex-col items-center leading-none">
          <span className="font-bold text-[19px] tracking-tight font-sans" style={titleStyle}>
            <span className={isMono ? "text-current" : theme === "dark" ? "text-[#00B4D8]" : "text-[#0090AD]"}>
              Fifth
            </span>
            <span className={isMono ? "text-current" : theme === "dark" ? "text-white" : "text-[#1C1852]"}>
              Events
            </span>
          </span>
          {showSubtitle && (
            <span 
              className="text-[9px] uppercase font-mono tracking-widest text-[#8E8EA0] font-semibold mt-1"
              style={subStyle}
            >
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
        <span className="font-bold text-[19px] tracking-tight font-sans" style={titleStyle}>
          <span className={isMono ? "text-current" : theme === "dark" ? "text-[#00B4D8]" : "text-[#0090AD]"}>
            Fifth
          </span>
          <span className={isMono ? "text-current" : theme === "dark" ? "text-white" : "text-[#1C1852]"}>
            Events
          </span>
        </span>
        {showSubtitle && (
          <span
            className={cn(
              "text-[9px] uppercase font-sans font-semibold tracking-wider mt-1",
              theme === "dark" ? "text-[#A3A3B2]" : "text-[#7C7C7C]"
            )}
            style={subStyle}
          >
            A FIFTHLAB PRODUCT
          </span>
        )}
      </div>
    </div>
  );
}
