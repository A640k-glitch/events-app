"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FifthEventsEmblem } from "@/components/brand/FifthEventsLogo";

export default function ScrollLogoBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Track global document scroll progress (0 at top to 1 at bottom of footer)
  const { scrollYProgress } = useScroll();

  // Ultra-smooth, critically-damped spring physics — zero overshoot, zero jitter
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 90,
    damping: 30,
    mass: 0.4,
    restDelta: 0.0001,
  });

  // Primary Emblem:
  // Starts in upper-right behind hero copy/spotlight, glides down with scroll,
  // and settles into the bottom-right corner glowing behind the frosted dark footer.
  // All coordinates strictly use consistent 'vh' and 'vw' units to prevent interpolation glitches.
  const primaryY = useTransform(smoothProgress, [0, 0.35, 0.7, 1], ["-2vh", "22vh", "50vh", "65vh"]);
  const primaryX = useTransform(smoothProgress, [0, 0.35, 0.7, 1], ["4vw", "-2vw", "1vw", "5vw"]);
  const primaryRotate = useTransform(smoothProgress, [0, 0.35, 0.7, 1], [-12, 10, -5, 0]);
  const primaryScale = useTransform(smoothProgress, [0, 0.35, 0.7, 1], [1.0, 1.22, 1.08, 0.92]);
  const primaryOpacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.38, 0.45, 0.48, 0.68]);

  // Secondary Left Parallax Emblem:
  // Provides subtle balance and atmospheric depth across mid-sections.
  const secondaryY = useTransform(smoothProgress, [0, 0.5, 1], ["18vh", "38vh", "58vh"]);
  const secondaryX = useTransform(smoothProgress, [0, 0.5, 1], ["-5vw", "2vw", "-4vw"]);
  const secondaryRotate = useTransform(smoothProgress, [0, 0.5, 1], [14, -10, 4]);
  const secondaryScale = useTransform(smoothProgress, [0, 0.5, 1], [0.85, 1.1, 0.78]);
  const secondaryOpacity = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [0.22, 0.35, 0.28, 0.2]);

  return (
    <div 
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none"
    >
      {/* 1. Primary Full-Color Emblem (Floats down and settles into bottom-right behind footer) */}
      <motion.div
        style={{
          y: mounted ? primaryY : "-2vh",
          x: mounted ? primaryX : "4vw",
          rotate: mounted ? primaryRotate : -12,
          scale: mounted ? primaryScale : 1.0,
          opacity: mounted ? primaryOpacity : 0.38,
        }}
        className="absolute top-0 right-0 will-change-transform pointer-events-none opacity-20 sm:opacity-100"
      >
        <div className="relative">
          {/* Ambient Glow Halo */}
          <div className="absolute -inset-16 bg-gradient-to-tr from-[#0090AD]/25 via-[#2DD4BF]/15 to-transparent rounded-full blur-3xl -z-10 pointer-events-none hidden sm:block" />
          <FifthEventsEmblem size={540} monochrome={false} />
        </div>
      </motion.div>

      {/* 2. Secondary Left-Side Parallax Emblem */}
      <motion.div
        style={{
          y: mounted ? secondaryY : "18vh",
          x: mounted ? secondaryX : "-5vw",
          rotate: mounted ? secondaryRotate : 14,
          scale: mounted ? secondaryScale : 0.85,
          opacity: mounted ? secondaryOpacity : 0.22,
        }}
        className="absolute top-0 left-0 will-change-transform pointer-events-none opacity-20 sm:opacity-100"
      >
        <div className="relative">
          <div className="absolute -inset-14 bg-gradient-to-br from-[#2B237C]/25 via-[#0090AD]/20 to-transparent rounded-full blur-3xl -z-10 pointer-events-none" />
          <FifthEventsEmblem size={390} monochrome={false} />
        </div>
      </motion.div>
    </div>
  );
}

