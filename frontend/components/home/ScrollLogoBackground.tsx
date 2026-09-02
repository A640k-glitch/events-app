"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FifthEventsEmblem } from "@/components/brand/FifthEventsLogo";

export default function ScrollLogoBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track global document scroll progress (0 at top to 1 at bottom of footer)
  const { scrollYProgress } = useScroll();

  // Ultra-smooth spring physics for fluid interpolation
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 65,
    damping: 24,
    restDelta: 0.001,
  });

  // Primary Emblem: starts near hero, travels through page, and settles at bottom-right corner slightly cut off
  const primaryY = useTransform(smoothProgress, [0, 0.35, 0.7, 1], ["-65vh", "-38vh", "-12vh", "45px"]);
  const primaryX = useTransform(smoothProgress, [0, 0.35, 0.7, 1], ["20px", "-40px", "0px", "65px"]);
  const primaryRotate = useTransform(smoothProgress, [0, 0.35, 0.7, 1], [-14, 16, -6, 0]);
  const primaryScale = useTransform(smoothProgress, [0, 0.35, 0.7, 1], [1.1, 1.35, 1.15, 0.88]);
  const primaryOpacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.35, 0.45, 0.42, 0.68]);

  // Secondary Left Parallax Emblem: provides depth in mid-sections and softens at footer
  const secondaryY = useTransform(smoothProgress, [0, 0.5, 1], ["-25vh", "-45vh", "20px"]);
  const secondaryX = useTransform(smoothProgress, [0, 0.5, 1], ["-20px", "30px", "-80px"]);
  const secondaryRotate = useTransform(smoothProgress, [0, 0.5, 1], [16, -14, 8]);
  const secondaryScale = useTransform(smoothProgress, [0, 0.5, 1], [0.9, 1.2, 0.72]);
  const secondaryOpacity = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [0.2, 0.38, 0.28, 0.2]);

  return (
    <div 
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none"
    >
      {/* 1. Primary Full-Color Emblem (Settles at bottom-right corner slightly cut off at footer) */}
      <motion.div
        style={{
          y: primaryY,
          x: primaryX,
          rotate: primaryRotate,
          scale: primaryScale,
          opacity: primaryOpacity,
        }}
        className="absolute bottom-0 right-0 filter drop-shadow-[0_25px_60px_rgba(0,144,173,0.32)] will-change-transform"
      >
        <div className="relative">
          {/* Ambient Glow Halo */}
          <div className="absolute -inset-16 bg-gradient-to-tr from-[#0090AD]/35 via-[#2DD4BF]/25 to-transparent rounded-full blur-3xl -z-10" />
          <FifthEventsEmblem size={560} monochrome={false} />
        </div>
      </motion.div>

      {/* 2. Secondary Left-Side Parallax Emblem */}
      <motion.div
        style={{
          y: secondaryY,
          x: secondaryX,
          rotate: secondaryRotate,
          scale: secondaryScale,
          opacity: secondaryOpacity,
        }}
        className="absolute bottom-0 left-0 filter drop-shadow-[0_20px_45px_rgba(43,35,124,0.25)] will-change-transform"
      >
        <div className="relative">
          <div className="absolute -inset-14 bg-gradient-to-br from-[#2B237C]/25 via-[#0090AD]/20 to-transparent rounded-full blur-3xl -z-10" />
          <FifthEventsEmblem size={400} monochrome={false} />
        </div>
      </motion.div>
    </div>
  );
}
