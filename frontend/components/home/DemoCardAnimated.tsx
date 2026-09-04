"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

const CHIPS = [
  {
    name: "fifthEvents",
    src: "/brand/fifthevents-emblem.png",
    delay: "0s",
    width: 180,
    height: 180,
    imgClass: "w-[92%] h-[92%] object-contain",
  },
  {
    name: "FinEdge",
    src: "/brand/finedge-logo.png",
    delay: "-2s",
    width: 200,
    height: 80,
    imgClass: "w-[94%] h-auto max-h-[88%] object-contain",
  },
  {
    name: "Bulkwave",
    src: "/brand/bulkwave-icon.png",
    delay: "-4s",
    width: 180,
    height: 180,
    imgClass: "w-[90%] h-[90%] object-contain",
  },
  {
    name: "Smerp",
    src: "/brand/smerp-icon.png",
    delay: "-6s",
    width: 180,
    height: 180,
    imgClass: "w-[90%] h-[90%] object-contain",
  },
  {
    name: "KuleanPay",
    src: "/brand/kuleanpay-icon.png",
    delay: "-8s",
    width: 180,
    height: 180,
    imgClass: "w-[90%] h-[90%] object-contain",
  },
  {
    name: "UCP",
    src: "/brand/ucp-emblem.png",
    delay: "-10s",
    width: 180,
    height: 180,
    imgClass: "w-[90%] h-[90%] object-contain",
  },
  {
    name: "TeXcellence",
    src: "/brand/texcellence-icon.webp",
    delay: "-12s",
    width: 180,
    height: 180,
    imgClass: "w-[90%] h-[90%] object-contain",
  },
];

export function DemoCardAnimated() {
  return (
    <>
      {/* ──────────────────────────────────────────────────────────────────────────
          1. MOBILE & TABLET (< xl): CONTAINER REMOVED, CAROUSEL FILLS FULL WIDTH
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="block xl:hidden w-full relative pt-2 pb-6 select-none overflow-hidden text-center">
        <style>{`
          .mobile-chip-orbit {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 106px;
            height: 106px;
            border-radius: 24px;
            background: #ffffff !important;
            border: 2.5px solid rgba(255, 255, 255, 0.98);
            box-shadow: 0 16px 36px rgba(21, 15, 69, 0.18);
            display: flex;
            align-items: center;
            justify-content: center;
            will-change: transform, opacity;
            animation: orbit-mobile-wide 14s linear infinite;
          }

          @media (min-width: 480px) {
            .mobile-chip-orbit {
              width: 126px;
              height: 126px;
              border-radius: 28px;
              box-shadow: 0 20px 42px rgba(21, 15, 69, 0.20);
            }
          }

          @media (min-width: 768px) {
            .mobile-chip-orbit {
              width: 152px;
              height: 152px;
              border-radius: 34px;
              box-shadow: 0 24px 50px rgba(21, 15, 69, 0.22);
            }
          }

          /* Small Mobile (< 640px) Orbit */
          @keyframes orbit-mobile-wide {
            0.0% { transform: translate(-50%, -50%) translate(0vw, 28px) scale(1.15); z-index: 35; opacity: 1.0; }
            5.0% { transform: translate(-50%, -50%) translate(11.7vw, 26.6px) scale(1.14); z-index: 33; opacity: 0.99; }
            10.0% { transform: translate(-50%, -50%) translate(22.3vw, 22.7px) scale(1.11); z-index: 31; opacity: 0.97; }
            15.0% { transform: translate(-50%, -50%) translate(30.7vw, 16.5px) scale(1.07); z-index: 28; opacity: 0.93; }
            20.0% { transform: translate(-50%, -50%) translate(36.1vw, 8.7px) scale(1.02); z-index: 24; opacity: 0.88; }
            25.0% { transform: translate(-50%, -50%) translate(38.0vw, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
            30.0% { transform: translate(-50%, -50%) translate(36.1vw, -8.7px) scale(0.91); z-index: 17; opacity: 0.79; }
            35.0% { transform: translate(-50%, -50%) translate(30.7vw, -16.5px) scale(0.86); z-index: 14; opacity: 0.75; }
            40.0% { transform: translate(-50%, -50%) translate(22.3vw, -22.7px) scale(0.83); z-index: 12; opacity: 0.73; }
            45.0% { transform: translate(-50%, -50%) translate(11.7vw, -26.6px) scale(0.81); z-index: 11; opacity: 0.72; }
            50.0% { transform: translate(-50%, -50%) translate(0vw, -28px) scale(0.80); z-index: 10; opacity: 0.70; }
            55.0% { transform: translate(-50%, -50%) translate(-11.7vw, -26.6px) scale(0.81); z-index: 11; opacity: 0.72; }
            60.0% { transform: translate(-50%, -50%) translate(-22.3vw, -22.7px) scale(0.83); z-index: 12; opacity: 0.73; }
            65.0% { transform: translate(-50%, -50%) translate(-30.7vw, -16.5px) scale(0.86); z-index: 14; opacity: 0.75; }
            70.0% { transform: translate(-50%, -50%) translate(-36.1vw, -8.7px) scale(0.91); z-index: 17; opacity: 0.79; }
            75.0% { transform: translate(-50%, -50%) translate(-38.0vw, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
            80.0% { transform: translate(-50%, -50%) translate(-36.1vw, 8.7px) scale(1.02); z-index: 24; opacity: 0.88; }
            85.0% { transform: translate(-50%, -50%) translate(-30.7vw, 16.5px) scale(1.07); z-index: 28; opacity: 0.93; }
            90.0% { transform: translate(-50%, -50%) translate(-22.3vw, 22.7px) scale(1.11); z-index: 31; opacity: 0.97; }
            95.0% { transform: translate(-50%, -50%) translate(-11.7vw, 26.6px) scale(1.14); z-index: 33; opacity: 0.99; }
            100.0% { transform: translate(-50%, -50%) translate(0vw, 28px) scale(1.15); z-index: 35; opacity: 1.0; }
          }

          /* Medium Screens / Small Tablets (640px to 767px) */
          @media (min-width: 640px) and (max-width: 767px) {
            @keyframes orbit-mobile-wide {
              0.0% { transform: translate(-50%, -50%) translate(0px, 34px) scale(1.15); z-index: 35; opacity: 1.0; }
              5.0% { transform: translate(-50%, -50%) translate(86px, 32.3px) scale(1.14); z-index: 33; opacity: 0.99; }
              10.0% { transform: translate(-50%, -50%) translate(164px, 27.5px) scale(1.11); z-index: 31; opacity: 0.97; }
              15.0% { transform: translate(-50%, -50%) translate(226px, 20.0px) scale(1.07); z-index: 28; opacity: 0.93; }
              20.0% { transform: translate(-50%, -50%) translate(266px, 10.5px) scale(1.02); z-index: 24; opacity: 0.88; }
              25.0% { transform: translate(-50%, -50%) translate(280px, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
              30.0% { transform: translate(-50%, -50%) translate(266px, -10.5px) scale(0.91); z-index: 17; opacity: 0.79; }
              35.0% { transform: translate(-50%, -50%) translate(226px, -20.0px) scale(0.86); z-index: 14; opacity: 0.75; }
              40.0% { transform: translate(-50%, -50%) translate(164px, -27.5px) scale(0.83); z-index: 12; opacity: 0.73; }
              45.0% { transform: translate(-50%, -50%) translate(86px, -32.3px) scale(0.81); z-index: 11; opacity: 0.72; }
              50.0% { transform: translate(-50%, -50%) translate(0px, -34px) scale(0.80); z-index: 10; opacity: 0.70; }
              55.0% { transform: translate(-50%, -50%) translate(-86px, -32.3px) scale(0.81); z-index: 11; opacity: 0.72; }
              60.0% { transform: translate(-50%, -50%) translate(-164px, -27.5px) scale(0.83); z-index: 12; opacity: 0.73; }
              65.0% { transform: translate(-50%, -50%) translate(-226px, -20.0px) scale(0.86); z-index: 14; opacity: 0.75; }
              70.0% { transform: translate(-50%, -50%) translate(-266px, -10.5px) scale(0.91); z-index: 17; opacity: 0.79; }
              75.0% { transform: translate(-50%, -50%) translate(-280px, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
              80.0% { transform: translate(-50%, -50%) translate(-266px, 10.5px) scale(1.02); z-index: 24; opacity: 0.88; }
              85.0% { transform: translate(-50%, -50%) translate(-226px, 20.0px) scale(1.07); z-index: 28; opacity: 0.93; }
              90.0% { transform: translate(-50%, -50%) translate(-164px, 27.5px) scale(1.11); z-index: 31; opacity: 0.97; }
              95.0% { transform: translate(-50%, -50%) translate(-86px, 32.3px) scale(1.14); z-index: 33; opacity: 0.99; }
              100.0% { transform: translate(-50%, -50%) translate(0px, 34px) scale(1.15); z-index: 35; opacity: 1.0; }
            }
          }

          /* Tablet & Stacked Desktop (768px to 1023px) — Fills Full Width Gracefully */
          @media (min-width: 768px) and (max-width: 1023px) {
            @keyframes orbit-mobile-wide {
              0.0% { transform: translate(-50%, -50%) translate(0px, 40px) scale(1.15); z-index: 35; opacity: 1.0; }
              5.0% { transform: translate(-50%, -50%) translate(117px, 38px) scale(1.14); z-index: 33; opacity: 0.99; }
              10.0% { transform: translate(-50%, -50%) translate(223px, 32px) scale(1.11); z-index: 31; opacity: 0.97; }
              15.0% { transform: translate(-50%, -50%) translate(307px, 24px) scale(1.07); z-index: 28; opacity: 0.93; }
              20.0% { transform: translate(-50%, -50%) translate(361px, 12px) scale(1.02); z-index: 24; opacity: 0.88; }
              25.0% { transform: translate(-50%, -50%) translate(380px, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
              30.0% { transform: translate(-50%, -50%) translate(361px, -12px) scale(0.91); z-index: 17; opacity: 0.79; }
              35.0% { transform: translate(-50%, -50%) translate(307px, -24px) scale(0.86); z-index: 14; opacity: 0.75; }
              40.0% { transform: translate(-50%, -50%) translate(223px, -32px) scale(0.83); z-index: 12; opacity: 0.73; }
              45.0% { transform: translate(-50%, -50%) translate(117px, -38px) scale(0.81); z-index: 11; opacity: 0.72; }
              50.0% { transform: translate(-50%, -50%) translate(0px, -40px) scale(0.80); z-index: 10; opacity: 0.70; }
              55.0% { transform: translate(-50%, -50%) translate(-117px, -38px) scale(0.81); z-index: 11; opacity: 0.72; }
              60.0% { transform: translate(-50%, -50%) translate(-223px, -32px) scale(0.83); z-index: 12; opacity: 0.73; }
              65.0% { transform: translate(-50%, -50%) translate(-307px, -24px) scale(0.86); z-index: 14; opacity: 0.75; }
              70.0% { transform: translate(-50%, -50%) translate(-361px, -12px) scale(0.91); z-index: 17; opacity: 0.79; }
              75.0% { transform: translate(-50%, -50%) translate(-380px, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
              80.0% { transform: translate(-50%, -50%) translate(-361px, 12px) scale(1.02); z-index: 24; opacity: 0.88; }
              85.0% { transform: translate(-50%, -50%) translate(-307px, 24px) scale(1.07); z-index: 28; opacity: 0.93; }
              90.0% { transform: translate(-50%, -50%) translate(-223px, 32px) scale(1.11); z-index: 31; opacity: 0.97; }
              95.0% { transform: translate(-50%, -50%) translate(-117px, 38px) scale(1.14); z-index: 33; opacity: 0.99; }
              100.0% { transform: translate(-50%, -50%) translate(0px, 40px) scale(1.15); z-index: 35; opacity: 1.0; }
            }
          }
        `}</style>

        {/* Wide Center Orbit Stage — Sized to fit large cards without dead whitespace */}
        <div className="relative w-full h-[180px] sm:h-[210px] md:h-[240px] my-1 flex items-center justify-center overflow-visible pointer-events-none">
          {CHIPS.map((chip) => (
            <div
              key={chip.name}
              className="mobile-chip-orbit pointer-events-auto"
              style={{ animationDelay: chip.delay }}
            >
              <Image
                src={chip.src}
                alt={chip.name}
                width={chip.width}
                height={chip.height}
                className={chip.imgClass}
                priority
              />
            </div>
          ))}
        </div>

        {/* Preserved Button at Bottom — Responsive, not oversized on mobile */}
        <div className="pt-1 z-30 relative">
          <Link
            href="/products"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-5 py-2 sm:px-6 sm:py-2.5 md:px-7 md:py-3 rounded-full bg-[#0090AD] hover:bg-[#007A94] text-white text-xs sm:text-sm font-bold shadow-md hover:shadow-lg transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Book Now</span>
            <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </Link>
        </div>
      </div>

      {/* ──────────────────────────────────────────────────────────────────────────
          2. DESKTOP (xl+): ORIGINAL EMBEDDED CARD CONTAINER
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="hidden xl:block relative flex-shrink-0 xl:w-[420px] xl:h-[420px] 2xl:w-[480px] 2xl:h-[480px] select-none">
        <div
          className="demo-card-root origin-top-left lg:scale-[0.475] xl:scale-[0.55] 2xl:scale-[0.60] transition-shadow duration-300"
          style={{
            position: "relative",
            width: "800px",
            height: "800px",
            background: "#FCEDFF",
            borderRadius: "40px",
            overflow: "hidden",
            boxShadow: "0 24px 50px rgba(21, 15, 69, 0.16)",
          }}
        >
          <style>{`
            .demo-card-root {
              --bg: #FCEDFF;
              --navy: #150F45;
              --teal: #0090AD;
              --teal-hover: #007A94;
            }

            .demo-blob {
              position: absolute;
              border-radius: 999px;
              filter: blur(2px);
              opacity: 0.55;
              pointer-events: none;
            }
            .demo-blob-teal {
              width: 260px;
              height: 130px;
              background: #24B4AC;
              top: -50px;
              right: -70px;
              transform: rotate(28deg);
              opacity: 0.32;
            }
            .demo-blob-lav {
              width: 220px;
              height: 110px;
              background: #C9B8F2;
              bottom: -30px;
              left: -60px;
              transform: rotate(-20deg);
              opacity: 0.38;
            }

            .demo-dotgrid {
              position: absolute;
              inset: 0;
              background-image: radial-gradient(rgba(21,15,69,0.08) 2px, transparent 2px);
              background-size: 26px 26px;
              mask-image: radial-gradient(circle at 50% 45%, black 20%, transparent 75%);
              -webkit-mask-image: radial-gradient(circle at 50% 45%, black 20%, transparent 75%);
              pointer-events: none;
            }

            .demo-wordmark {
              position: absolute;
              top: 52px;
              left: 50%;
              transform: translateX(-50%);
              font-size: 26px;
              font-weight: 800;
              color: #150F45;
              letter-spacing: 0.02em;
              opacity: 0.95;
              white-space: nowrap;
              z-index: 40;
              text-decoration: none;
              display: flex;
              align-items: center;
              gap: 10px;
            }
            .demo-wordmark span {
              color: #0090AD;
            }

            .carousel-stage {
              position: absolute;
              top: 365px;
              left: 50%;
              width: 0;
              height: 0;
              pointer-events: none;
            }

            .orbit-chip {
              position: absolute;
              top: 0;
              left: 0;
              width: 216px;
              height: 216px;
              margin-left: -108px;
              margin-top: -108px;
              border-radius: 46px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #ffffff !important;
              border: 3px solid rgba(255, 255, 255, 0.98);
              box-shadow: 0 24px 50px rgba(21, 15, 69, 0.20);
              will-change: transform, opacity;
              animation: orbit-loop 14s linear infinite;
            }

            @keyframes orbit-loop {
              0.0% { transform: translate(0.0px, 80.0px) scale(1.1); z-index: 30; opacity: 1.0; }
              5.0% { transform: translate(77.3px, 76.1px) scale(1.09); z-index: 29; opacity: 0.99; }
              10.0% { transform: translate(146.9px, 64.7px) scale(1.06); z-index: 28; opacity: 0.96; }
              15.0% { transform: translate(202.3px, 47.0px) scale(1.02); z-index: 25; opacity: 0.91; }
              20.0% { transform: translate(237.8px, 24.7px) scale(0.97); z-index: 23; opacity: 0.84; }
              25.0% { transform: translate(250.0px, 0.0px) scale(0.91); z-index: 20; opacity: 0.78; }
              30.0% { transform: translate(237.8px, -24.7px) scale(0.85); z-index: 16; opacity: 0.71; }
              35.0% { transform: translate(202.3px, -47.0px) scale(0.8); z-index: 14; opacity: 0.64; }
              40.0% { transform: translate(146.9px, -64.7px) scale(0.76); z-index: 11; opacity: 0.59; }
              45.0% { transform: translate(77.3px, -76.1px) scale(0.73); z-index: 10; opacity: 0.56; }
              50.0% { transform: translate(0.0px, -80.0px) scale(0.72); z-index: 10; opacity: 0.55; }
              55.0% { transform: translate(-77.3px, -76.1px) scale(0.73); z-index: 10; opacity: 0.56; }
              60.0% { transform: translate(-146.9px, -64.7px) scale(0.76); z-index: 11; opacity: 0.59; }
              65.0% { transform: translate(-202.3px, -47.0px) scale(0.8); z-index: 14; opacity: 0.64; }
              70.0% { transform: translate(-237.8px, -24.7px) scale(0.85); z-index: 16; opacity: 0.71; }
              75.0% { transform: translate(-250.0px, -0.0px) scale(0.91); z-index: 20; opacity: 0.78; }
              80.0% { transform: translate(-237.8px, 24.7px) scale(0.97); z-index: 23; opacity: 0.84; }
              85.0% { transform: translate(-202.3px, 47.0px) scale(1.02); z-index: 25; opacity: 0.91; }
              90.0% { transform: translate(-146.9px, 64.7px) scale(1.06); z-index: 28; opacity: 0.96; }
              95.0% { transform: translate(-77.3px, 76.1px) scale(1.09); z-index: 29; opacity: 0.99; }
              100.0% { transform: translate(-0.0px, 80.0px) scale(1.1); z-index: 30; opacity: 1.0; }
            }

            .demo-pill-btn {
              position: absolute;
              left: 50%;
              bottom: 65px;
              transform: translateX(-50%);
              padding: 22px 52px;
              border-radius: 999px;
              background: #0090AD;
              color: #ffffff !important;
              font-weight: 800;
              font-size: 26px;
              letter-spacing: 0.02em;
              white-space: nowrap;
              box-shadow: 0 16px 36px rgba(0, 144, 173, 0.42);
              transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
              cursor: pointer;
              z-index: 50;
              text-decoration: none;
              display: inline-flex;
              align-items: center;
              gap: 12px;
            }

            .demo-pill-btn:hover {
              background: #007A94;
              transform: translateX(-50%) scale(1.06);
              box-shadow: 0 22px 46px rgba(0, 144, 173, 0.58);
            }
          `}</style>

          {/* Ambient Brand Blobs & Dot Grid */}
          <div className="demo-dotgrid" />
          <div className="demo-blob demo-blob-teal" />
          <div className="demo-blob demo-blob-lav" />

          {/* Center Stage Orbit */}
          <div className="carousel-stage">
            {CHIPS.map((chip) => (
              <div
                key={chip.name}
                className="orbit-chip"
                style={{ animationDelay: chip.delay }}
              >
                <Image
                  src={chip.src}
                  alt={chip.name}
                  width={chip.width}
                  height={chip.height}
                  className={chip.imgClass}
                  priority
                />
              </div>
            ))}
          </div>

          {/* "Book Now" Button */}
          <Link href="/products" className="demo-pill-btn">
            <span>Book Now</span>
            <ArrowRight className="w-7 h-7" />
          </Link>
        </div>
      </div>
    </>
  );
}
