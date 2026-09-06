"use client";

import Image from "next/image";
import { motion } from "framer-motion";

export default function IPhoneMockup() {
  // Phone dimensions — 100% normal, authentic iPhone 16 Pro (untouched)
  const W = 260;
  const H = 548;
  const BEZEL = 10;
  const R_OUT = 44;
  const R_IN = 35;
  const SW = W - BEZEL * 2;
  const SH = H - BEZEL * 2;

  // Card dimensions — compact backdrop card sitting behind lower phone
  const CARD_W = 310;
  const CARD_H = 270; // Shorter card height as requested
  const CUT_BOTTOM = 42; // Naturally cuts off bottom ~7.5% of phone at the card base
  const VISIBLE_PHONE_H = H - CUT_BOTTOM; // 506px

  return (
    <div
      className="relative flex sm:hidden lg:flex items-center justify-center flex-shrink-0 select-none"
      style={{ width: CARD_W, height: VISIBLE_PHONE_H }}
    >
      {/* ── Rounded Corner Backdrop Card: top rounded corners, flat bottom so curves at the end never show ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          width: CARD_W,
          height: CARD_H,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          background: "linear-gradient(165deg, #ECE5FA 0%, #E2DAF7 100%)",
          border: "1.5px solid rgba(56, 44, 132, 0.16)",
          borderBottom: "none",
          zIndex: 1,
        }}
      />

      {/* ── Phone wrapper: cuts off phone cleanly at card bottom only; top and sides remain 100% unclipped ── */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
          width: W,
          height: VISIBLE_PHONE_H,
          clipPath: "inset(-120px -30px 0px -30px)",
          WebkitClipPath: "inset(-120px -30px 0px -30px)",
        }}
      >
        {/* ── Entry Animation: Phone swipes UP smoothly from the bottom of the card ── */}
        <motion.div
          initial={{ y: 90, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{
            type: "spring",
            stiffness: 85,
            damping: 18,
            mass: 0.8,
            delay: 0.15,
          }}
          style={{
            width: W,
            height: H,
          }}
        >
          {/* Outer chassis — 100% normal iPhone with original curvature */}
          <div
            style={{
              width: W,
              height: H,
              borderRadius: R_OUT,
              background:
                "linear-gradient(155deg, #2d2d2d 0%, #0e0e0e 55%, #1d1d1d 100%)",
              boxShadow: `
                0 0 0 1.5px #3c3c3c,
                0 0 0 3px #080808,
                inset 0 0 0 1px #2e2e2e,
                0 20px 40px rgba(0,0,0,0.25)
              `,
              padding: BEZEL,
              position: "relative",
              boxSizing: "border-box",
            }}
          >
            {/* Screen */}
            <div
              style={{
                width: SW,
                height: SH,
                borderRadius: R_IN,
                background: "#000",
                overflow: "hidden",
                position: "relative",
              }}
            >
              {/* Mobile screenshot */}
              <Image
                src="/brand/phone-preview.png"
                alt="FifthEvents mobile preview"
                fill
                sizes="240px"
                style={{
                  objectFit: "cover",
                  objectPosition: "top center",
                }}
                priority
              />

              {/* Screen glint */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: R_IN,
                  background:
                    "linear-gradient(130deg, rgba(255,255,255,0.05) 0%, transparent 30%)",
                  pointerEvents: "none",
                  zIndex: 30,
                }}
              />
            </div>

            {/* Action button (left, top) */}
            <div
              style={{
                position: "absolute",
                left: -3.5,
                top: 80,
                width: 3.5,
                height: 18,
                background: "#272727",
                borderRadius: "2px 0 0 2px",
                boxShadow: "-1px 0 3px rgba(0,0,0,0.6)",
              }}
            />
            {/* Volume up */}
            <div
              style={{
                position: "absolute",
                left: -3.5,
                top: 108,
                width: 3.5,
                height: 30,
                background: "#272727",
                borderRadius: "2px 0 0 2px",
                boxShadow: "-1px 0 3px rgba(0,0,0,0.6)",
              }}
            />
            {/* Volume down */}
            <div
              style={{
                position: "absolute",
                left: -3.5,
                top: 146,
                width: 3.5,
                height: 30,
                background: "#272727",
                borderRadius: "2px 0 0 2px",
                boxShadow: "-1px 0 3px rgba(0,0,0,0.6)",
              }}
            />
            {/* Power button (right) */}
            <div
              style={{
                position: "absolute",
                right: -3.5,
                top: 116,
                width: 3.5,
                height: 52,
                background: "#272727",
                borderRadius: "0 2px 2px 0",
                boxShadow: "1px 0 3px rgba(0,0,0,0.6)",
              }}
            />

            {/* USB-C (bottom center) */}
            <div
              style={{
                position: "absolute",
                bottom: BEZEL + 5,
                left: "50%",
                transform: "translateX(-50%)",
                width: 38,
                height: 5,
                background: "#181818",
                borderRadius: 3,
              }}
            />

            {/* Chassis outer glint */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                borderRadius: R_OUT,
                background:
                  "linear-gradient(145deg, rgba(255,255,255,0.04) 0%, transparent 28%)",
                pointerEvents: "none",
                zIndex: 40,
              }}
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
