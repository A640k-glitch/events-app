"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";
import { FifthEventsEmblem } from "@/components/brand/FifthEventsLogo";

export default function ScrollLogoBackground() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Track window page scroll progress (0 to 1)
  const { scrollYProgress } = useScroll();

  // Smooth scroll physics
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 22,
    restDelta: 0.001,
  });

  // Primary large floating emblem scroll mappings:
  // Zooms in during hero/mid sections, then smoothly zooms out (scale 0.75) and centers near the footer with higher prominence!
  const primaryY = useTransform(smoothProgress, [0, 0.3, 0.65, 1], [-20, 260, 600, 1100]);
  const primaryX = useTransform(smoothProgress, [0, 0.35, 0.7, 1], [0, -70, -20, -160]);
  const primaryRotate = useTransform(smoothProgress, [0, 0.35, 0.7, 1], [-12, 16, -6, 0]);
  const primaryScale = useTransform(smoothProgress, [0, 0.35, 0.7, 1], [1.0, 1.35, 1.15, 0.78]);
  const primaryOpacity = useTransform(smoothProgress, [0, 0.3, 0.7, 1], [0.35, 0.45, 0.4, 0.65]);

  // Secondary emblem scroll mappings (zooms out into lower footer backdrop)
  const secondaryY = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [60, -40, 260, 520]);
  const secondaryRotate = useTransform(smoothProgress, [0, 0.5, 1], [18, -12, 0]);
  const secondaryScale = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [0.85, 1.15, 0.95, 0.68]);
  const secondaryOpacity = useTransform(smoothProgress, [0, 0.4, 0.8, 1], [0.22, 0.35, 0.32, 0.55]);

  return (
    <div 
      ref={containerRef}
      aria-hidden="true"
      className="fixed inset-0 overflow-hidden pointer-events-none z-0 select-none"
    >
      {/* 1. Primary Full-Color Emblem (Zooms out and aligns cleanly at the end) */}
      <motion.div
        style={{
          y: primaryY,
          x: primaryX,
          rotate: primaryRotate,
          scale: primaryScale,
          opacity: primaryOpacity,
        }}
        className="absolute top-[8%] -right-8 sm:right-[5%] md:right-[10%] filter drop-shadow-[0_25px_60px_rgba(0,144,173,0.3)] will-change-transform"
      >
        <div className="relative">
          {/* Ambient Glow */}
          <div className="absolute -inset-16 bg-gradient-to-tr from-[#0090AD]/30 via-[#2DD4BF]/25 to-transparent rounded-full blur-3xl -z-10" />
          <FifthEventsEmblem size={520} monochrome={false} />
        </div>
      </motion.div>

      {/* 2. Secondary Full-Color Emblem */}
      <motion.div
        style={{
          y: secondaryY,
          rotate: secondaryRotate,
          scale: secondaryScale,
          opacity: secondaryOpacity,
        }}
        className="absolute top-[45%] -left-12 sm:left-[3%] md:left-[6%] filter drop-shadow-[0_20px_45px_rgba(43,35,124,0.28)] will-change-transform"
      >
        <div className="relative">
          <div className="absolute -inset-14 bg-gradient-to-br from-[#2B237C]/25 via-[#0090AD]/20 to-transparent rounded-full blur-3xl -z-10" />
          <FifthEventsEmblem size={380} monochrome={false} />
        </div>
      </motion.div>
    </div>
  );
}
