"use client";

import React from "react";
import Image from "next/image";

export default function AuthVisualShowcase() {
  return (
    <div className="relative w-full h-full min-h-screen overflow-hidden select-none bg-slate-950">
      {/* Full height, edge-to-edge photography with zero overlays, pills or logos */}
      <Image
        src="/images/auth/real_lagos_checkin.jpg"
        alt="Lagos Tech Summit Check-in"
        fill
        priority
        className="object-cover object-center"
        sizes="50vw"
      />
    </div>
  );
}
