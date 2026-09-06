"use client";

import React from "react";
import { DemoCardAnimated } from "./DemoCardAnimated";

export default function HeroSpotlightCarousel() {
  return (
    <div className="relative w-full py-0 sm:py-1 flex flex-col items-center justify-center text-center">
      {/* Pill-less Bold Eyebrow & Punchy Question Heading */}
      <div className="mb-2 sm:mb-3 max-w-2xl px-4">
        <span className="text-xs sm:text-sm font-extrabold uppercase tracking-widest text-[#0090AD] block mb-1 font-mono">
          Enterprise Product Ecosystem
        </span>
        <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-white leading-tight">
          Want to see our solutions live in action?
        </h2>
        <p className="mt-1 text-xs sm:text-sm text-slate-400 max-w-md mx-auto">
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
