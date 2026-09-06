"use client";

import React from "react";
import { DemoCardAnimated } from "./DemoCardAnimated";

export default function HeroSpotlightCarousel() {
  return (
    <div className="relative w-full py-1 sm:py-2 flex flex-col items-center justify-center text-center">
      {/* Pill-less Bold Eyebrow & Punchy Question Heading */}
      <div className="mb-4 sm:mb-5 max-w-2xl px-4">
        <span className="text-[11px] sm:text-xs font-extrabold uppercase tracking-widest text-[#0090AD] block mb-2 font-mono">
          Enterprise Product Ecosystem
        </span>
        <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-snug sm:leading-tight max-w-xl mx-auto">
          Want to see our solutions live in action?
        </h2>
        <p className="mt-2 text-xs sm:text-sm text-slate-400 max-w-md mx-auto leading-relaxed">
          Test drive core banking, payments, and ERP tools on site, or book a private executive demo.
        </p>
      </div>

      {/* Centered Product Ecosystem Interactive Showcase */}
      <div className="w-full flex items-center justify-center z-20 overflow-visible">
        <DemoCardAnimated />
      </div>
    </div>
  );
}
