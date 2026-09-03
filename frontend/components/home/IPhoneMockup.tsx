"use client";

import Image from "next/image";

export default function IPhoneMockup() {
  // Phone dimensions
  const W = 260;
  const H = 548;
  const BEZEL = 10;
  const R_OUT = 44;
  const R_IN = 35;
  const SW = W - BEZEL * 2;
  const SH = H - BEZEL * 2;

  return (
    <div
      className="relative hidden lg:flex items-center justify-center flex-shrink-0 select-none"
      style={{ width: W + 32, height: H + 32 }}
    >
      {/* ── UNIFIED 3D PERSPECTIVE WORMHOLE FLOOR PLANE (Anchored directly at phone base) ── */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -80,
          left: "50%",
          transform: "translateX(-50%) perspective(500px) rotateX(75deg)",
          transformOrigin: "center center",
          width: 580,
          height: 360,
          pointerEvents: "none",
          zIndex: 0,
        }}
      >
        {/* The Perspective Grid Floor */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage: `
              linear-gradient(to right, rgba(0, 144, 173, 0.42) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(0, 144, 173, 0.42) 1px, transparent 1px)
            `,
            backgroundSize: "24px 24px",
            maskImage:
              "radial-gradient(ellipse 75% 65% at 50% 50%, black 25%, rgba(0,0,0,0.5) 60%, transparent 90%)",
            WebkitMaskImage:
              "radial-gradient(ellipse 75% 65% at 50% 50%, black 25%, rgba(0,0,0,0.5) 60%, transparent 90%)",
          }}
        />

        {/* Outer Concentric Depth Ring */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 440,
            height: 270,
            borderRadius: "50%",
            border: "1.5px solid rgba(0, 144, 173, 0.45)",
            boxShadow: "0 0 32px rgba(0, 144, 173, 0.25), inset 0 0 30px rgba(0, 144, 173, 0.2)",
          }}
        />

        {/* Mid Concentric Depth Ring */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 310,
            height: 190,
            borderRadius: "50%",
            border: "2px solid rgba(0, 180, 216, 0.75)",
            boxShadow: "0 0 28px rgba(0, 180, 216, 0.4), inset 0 0 25px rgba(0, 180, 216, 0.28)",
          }}
        />

        {/* Inner Core Vortex Ring */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 190,
            height: 115,
            borderRadius: "50%",
            border: "2.5px solid rgba(0, 215, 245, 0.95)",
            boxShadow: "0 0 24px rgba(0, 215, 245, 0.65), inset 0 0 20px rgba(0, 215, 245, 0.5)",
          }}
        />

        {/* Ambient Vortex Light Core */}
        <div
          style={{
            position: "absolute",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            width: 130,
            height: 80,
            borderRadius: "50%",
            background: "radial-gradient(ellipse, rgba(0, 215, 245, 0.55) 0%, rgba(0, 144, 173, 0.25) 50%, transparent 80%)",
            filter: "blur(10px)",
          }}
        />
      </div>

      {/* ── Multi-Layer Deep Grounding Shadow Directly Under Phone Base ── */}
      {/* 1. Ultra-dense dark contact shadow right beneath phone glass edge */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 14,
          left: "50%",
          transform: "translateX(-50%)",
          width: 240,
          height: 12,
          borderRadius: "50%",
          background: "rgba(0, 0, 0, 0.95)",
          filter: "blur(3px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* 2. Deep ambient occlusion shadow spreading across floor */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: 4,
          left: "50%",
          transform: "translateX(-50%)",
          width: 280,
          height: 30,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0, 0, 0, 0.88) 0%, rgba(0, 0, 0, 0.5) 45%, transparent 75%)",
          filter: "blur(7px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* 3. Wide floor diffuse shadow with subtle teal bounce */}
      <div
        aria-hidden
        style={{
          position: "absolute",
          bottom: -8,
          left: "50%",
          transform: "translateX(-50%)",
          width: 350,
          height: 50,
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(0, 0, 0, 0.45) 0%, rgba(0, 144, 173, 0.35) 40%, transparent 75%)",
          filter: "blur(14px)",
          zIndex: 1,
          pointerEvents: "none",
        }}
      />

      {/* Straight, upright phone container without 3D rotation or hover animations */}
      <div
        style={{
          position: "relative",
          zIndex: 2,
        }}
      >
        {/* Outer chassis */}
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
              0 24px 60px rgba(0,0,0,0.35),
              0 6px 20px rgba(0,0,0,0.2)
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
      </div>
    </div>
  );
}
