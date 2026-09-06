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
  {
    name: "BeetVAS",
    src: "/brand/beetvaslogo.png",
    delay: "-14s",
    width: 200,
    height: 64,
    imgClass: "w-[92%] h-auto max-h-[82%] object-contain",
  },
  {
    name: "SmerpGo",
    src: "/brand/smerpgo-logo.png",
    delay: "-16s",
    width: 200,
    height: 68,
    imgClass: "w-[92%] h-auto max-h-[82%] object-contain",
  },
];

export function DemoCardAnimated() {
  return (
    <>
      {/* ──────────────────────────────────────────────────────────────────────────
          1. MOBILE & TABLET (< xl): CONTAINER REMOVED, CAROUSEL FILLS FULL WIDTH
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="block xl:hidden w-full relative pt-2 pb-6 select-none overflow-visible text-center">
        <style>{`
          .mobile-chip-orbit {
            position: absolute;
            top: 50%;
            left: 50%;
            width: 118px;
            height: 118px;
            border-radius: 26px;
            background: #ffffff !important;
            border: 2.5px solid rgba(255, 255, 255, 0.98);
            box-shadow: 0 16px 36px rgba(0, 0, 0, 0.45), 0 0 24px rgba(0, 144, 173, 0.12);
            display: flex;
            align-items: center;
            justify-content: center;
            will-change: transform, opacity;
            animation: orbit-mobile-wide 18s linear infinite;
          }

          @media (min-width: 480px) {
            .mobile-chip-orbit {
              width: 140px;
              height: 140px;
              border-radius: 30px;
              box-shadow: 0 20px 42px rgba(21, 15, 69, 0.20);
            }
          }

          @media (min-width: 768px) {
            .mobile-chip-orbit {
              width: 168px;
              height: 168px;
              border-radius: 36px;
              box-shadow: 0 24px 50px rgba(21, 15, 69, 0.22);
            }
          }

          /* Small Mobile (< 640px) Orbit — stays safely within viewport borders without shrinking chips */
          @keyframes orbit-mobile-wide {
            0.0% { transform: translate(-50%, -50%) translate(0vw, 28px) scale(1.15); z-index: 35; opacity: 1.0; }
            5.0% { transform: translate(-50%, -50%) translate(9.3vw, 26.6px) scale(1.14); z-index: 33; opacity: 0.99; }
            10.0% { transform: translate(-50%, -50%) translate(17.6vw, 22.7px) scale(1.11); z-index: 31; opacity: 0.97; }
            15.0% { transform: translate(-50%, -50%) translate(24.3vw, 16.5px) scale(1.07); z-index: 28; opacity: 0.93; }
            20.0% { transform: translate(-50%, -50%) translate(28.5vw, 8.7px) scale(1.02); z-index: 24; opacity: 0.88; }
            25.0% { transform: translate(-50%, -50%) translate(30.0vw, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
            30.0% { transform: translate(-50%, -50%) translate(28.5vw, -8.7px) scale(0.91); z-index: 17; opacity: 0.79; }
            35.0% { transform: translate(-50%, -50%) translate(24.3vw, -16.5px) scale(0.86); z-index: 14; opacity: 0.75; }
            40.0% { transform: translate(-50%, -50%) translate(17.6vw, -22.7px) scale(0.83); z-index: 12; opacity: 0.73; }
            45.0% { transform: translate(-50%, -50%) translate(9.3vw, -26.6px) scale(0.81); z-index: 11; opacity: 0.72; }
            50.0% { transform: translate(-50%, -50%) translate(0vw, -28px) scale(0.80); z-index: 10; opacity: 0.70; }
            55.0% { transform: translate(-50%, -50%) translate(-9.3vw, -26.6px) scale(0.81); z-index: 11; opacity: 0.72; }
            60.0% { transform: translate(-50%, -50%) translate(-17.6vw, -22.7px) scale(0.83); z-index: 12; opacity: 0.73; }
            65.0% { transform: translate(-50%, -50%) translate(-24.3vw, -16.5px) scale(0.86); z-index: 14; opacity: 0.75; }
            70.0% { transform: translate(-50%, -50%) translate(-28.5vw, -8.7px) scale(0.91); z-index: 17; opacity: 0.79; }
            75.0% { transform: translate(-50%, -50%) translate(-30.0vw, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
            80.0% { transform: translate(-50%, -50%) translate(-28.5vw, 8.7px) scale(1.02); z-index: 24; opacity: 0.88; }
            85.0% { transform: translate(-50%, -50%) translate(-24.3vw, 16.5px) scale(1.07); z-index: 28; opacity: 0.93; }
            90.0% { transform: translate(-50%, -50%) translate(-17.6vw, 22.7px) scale(1.11); z-index: 31; opacity: 0.97; }
            95.0% { transform: translate(-50%, -50%) translate(-9.3vw, 26.6px) scale(1.14); z-index: 33; opacity: 0.99; }
            100.0% { transform: translate(-50%, -50%) translate(0vw, 28px) scale(1.15); z-index: 35; opacity: 1.0; }
          }

          /* Medium Screens / Small Tablets (640px to 767px) */
          @media (min-width: 640px) and (max-width: 767px) {
            @keyframes orbit-mobile-wide {
              0.0% { transform: translate(-50%, -50%) translate(0px, 34px) scale(1.15); z-index: 35; opacity: 1.0; }
              5.0% { transform: translate(-50%, -50%) translate(65px, 32.3px) scale(1.14); z-index: 33; opacity: 0.99; }
              10.0% { transform: translate(-50%, -50%) translate(123px, 27.5px) scale(1.11); z-index: 31; opacity: 0.97; }
              15.0% { transform: translate(-50%, -50%) translate(170px, 20.0px) scale(1.07); z-index: 28; opacity: 0.93; }
              20.0% { transform: translate(-50%, -50%) translate(200px, 10.5px) scale(1.02); z-index: 24; opacity: 0.88; }
              25.0% { transform: translate(-50%, -50%) translate(210px, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
              30.0% { transform: translate(-50%, -50%) translate(200px, -10.5px) scale(0.91); z-index: 17; opacity: 0.79; }
              35.0% { transform: translate(-50%, -50%) translate(170px, -20.0px) scale(0.86); z-index: 14; opacity: 0.75; }
              40.0% { transform: translate(-50%, -50%) translate(123px, -27.5px) scale(0.83); z-index: 12; opacity: 0.73; }
              45.0% { transform: translate(-50%, -50%) translate(65px, -32.3px) scale(0.81); z-index: 11; opacity: 0.72; }
              50.0% { transform: translate(-50%, -50%) translate(0px, -34px) scale(0.80); z-index: 10; opacity: 0.70; }
              55.0% { transform: translate(-50%, -50%) translate(-65px, -32.3px) scale(0.81); z-index: 11; opacity: 0.72; }
              60.0% { transform: translate(-50%, -50%) translate(-123px, -27.5px) scale(0.83); z-index: 12; opacity: 0.73; }
              65.0% { transform: translate(-50%, -50%) translate(-170px, -20.0px) scale(0.86); z-index: 14; opacity: 0.75; }
              70.0% { transform: translate(-50%, -50%) translate(-200px, -10.5px) scale(0.91); z-index: 17; opacity: 0.79; }
              75.0% { transform: translate(-50%, -50%) translate(-210px, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
              80.0% { transform: translate(-50%, -50%) translate(-200px, 10.5px) scale(1.02); z-index: 24; opacity: 0.88; }
              85.0% { transform: translate(-50%, -50%) translate(-170px, 20.0px) scale(1.07); z-index: 28; opacity: 0.93; }
              90.0% { transform: translate(-50%, -50%) translate(-123px, 27.5px) scale(1.11); z-index: 31; opacity: 0.97; }
              95.0% { transform: translate(-50%, -50%) translate(-65px, 32.3px) scale(1.14); z-index: 33; opacity: 0.99; }
              100.0% { transform: translate(-50%, -50%) translate(0px, 34px) scale(1.15); z-index: 35; opacity: 1.0; }
            }
          }

          /* Tablet & Stacked Desktop (768px to 1023px) — Fills Full Width Gracefully */
          @media (min-width: 768px) and (max-width: 1023px) {
            @keyframes orbit-mobile-wide {
              0.0% { transform: translate(-50%, -50%) translate(0px, 40px) scale(1.15); z-index: 35; opacity: 1.0; }
              5.0% { transform: translate(-50%, -50%) translate(80px, 38px) scale(1.14); z-index: 33; opacity: 0.99; }
              10.0% { transform: translate(-50%, -50%) translate(153px, 32px) scale(1.11); z-index: 31; opacity: 0.97; }
              15.0% { transform: translate(-50%, -50%) translate(210px, 24px) scale(1.07); z-index: 28; opacity: 0.93; }
              20.0% { transform: translate(-50%, -50%) translate(247px, 12px) scale(1.02); z-index: 24; opacity: 0.88; }
              25.0% { transform: translate(-50%, -50%) translate(260px, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
              30.0% { transform: translate(-50%, -50%) translate(247px, -12px) scale(0.91); z-index: 17; opacity: 0.79; }
              35.0% { transform: translate(-50%, -50%) translate(210px, -24px) scale(0.86); z-index: 14; opacity: 0.75; }
              40.0% { transform: translate(-50%, -50%) translate(153px, -32px) scale(0.83); z-index: 12; opacity: 0.73; }
              45.0% { transform: translate(-50%, -50%) translate(80px, -38px) scale(0.81); z-index: 11; opacity: 0.72; }
              50.0% { transform: translate(-50%, -50%) translate(0px, -40px) scale(0.80); z-index: 10; opacity: 0.70; }
              55.0% { transform: translate(-50%, -50%) translate(-80px, -38px) scale(0.81); z-index: 11; opacity: 0.72; }
              60.0% { transform: translate(-50%, -50%) translate(-153px, -32px) scale(0.83); z-index: 12; opacity: 0.73; }
              65.0% { transform: translate(-50%, -50%) translate(-210px, -24px) scale(0.86); z-index: 14; opacity: 0.75; }
              70.0% { transform: translate(-50%, -50%) translate(-247px, -12px) scale(0.91); z-index: 17; opacity: 0.79; }
              75.0% { transform: translate(-50%, -50%) translate(-260px, 0.0px) scale(0.96); z-index: 20; opacity: 0.84; }
              80.0% { transform: translate(-50%, -50%) translate(-247px, 12px) scale(1.02); z-index: 24; opacity: 0.88; }
              85.0% { transform: translate(-50%, -50%) translate(-210px, 24px) scale(1.07); z-index: 28; opacity: 0.93; }
              90.0% { transform: translate(-50%, -50%) translate(-153px, 32px) scale(1.11); z-index: 31; opacity: 0.97; }
              95.0% { transform: translate(-50%, -50%) translate(-80px, 38px) scale(1.14); z-index: 33; opacity: 0.99; }
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

        {/* Preserved Button at Bottom — Responsive, slightly lowered without expanding section height */}
        <div className="pt-0 z-30 relative translate-y-2">
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
          2. DESKTOP (xl+): EMBEDDED LOGOS ORBIT (WIDER HORIZONTAL SPREAD, TIGHTER VERTICAL)
          ────────────────────────────────────────────────────────────────────────── */}
      <div className="hidden xl:block relative flex-shrink-0 xl:w-[680px] xl:h-[360px] 2xl:w-[780px] 2xl:h-[400px] select-none overflow-visible">
        <div
          className="demo-card-root origin-top-left xl:scale-[0.68] 2xl:scale-[0.78] transition-shadow duration-300"
          style={{
            position: "relative",
            width: "1000px",
            height: "520px",
            overflow: "visible",
          }}
        >
          <style>{`
            .demo-card-root {
              --navy: #150F45;
              --teal: #0090AD;
              --teal-hover: #007A94;
            }

            .carousel-stage {
              position: absolute;
              top: 220px;
              left: 50%;
              width: 0;
              height: 0;
              pointer-events: none;
            }

            .orbit-chip {
              position: absolute;
              top: 0;
              left: 0;
              width: 240px;
              height: 240px;
              margin-left: -120px;
              margin-top: -120px;
              border-radius: 52px;
              display: flex;
              align-items: center;
              justify-content: center;
              background: #ffffff !important;
              border: 3px solid rgba(255, 255, 255, 0.98);
              box-shadow: 0 24px 55px rgba(0, 0, 0, 0.55), 0 0 30px rgba(0, 144, 173, 0.15);
              will-change: transform, opacity;
              animation: orbit-loop-wide 18s linear infinite;
            }

            /* Wider ellipse for desktop: Rx = 430px, Ry = 62px */
            @keyframes orbit-loop-wide {
              0.0% { transform: translate(0.0px, 62.0px) scale(1.1); z-index: 30; opacity: 1.0; }
              5.0% { transform: translate(133px, 58.9px) scale(1.09); z-index: 29; opacity: 0.99; }
              10.0% { transform: translate(253px, 50.1px) scale(1.06); z-index: 28; opacity: 0.96; }
              15.0% { transform: translate(348px, 36.4px) scale(1.02); z-index: 25; opacity: 0.91; }
              20.0% { transform: translate(409px, 19.1px) scale(0.97); z-index: 23; opacity: 0.84; }
              25.0% { transform: translate(430.0px, 0.0px) scale(0.91); z-index: 20; opacity: 0.78; }
              30.0% { transform: translate(409px, -19.1px) scale(0.85); z-index: 16; opacity: 0.71; }
              35.0% { transform: translate(348px, -36.4px) scale(0.8); z-index: 14; opacity: 0.64; }
              40.0% { transform: translate(253px, -50.1px) scale(0.76); z-index: 11; opacity: 0.59; }
              45.0% { transform: translate(133px, -58.9px) scale(0.73); z-index: 10; opacity: 0.56; }
              50.0% { transform: translate(0.0px, -62.0px) scale(0.72); z-index: 10; opacity: 0.55; }
              55.0% { transform: translate(-133px, -58.9px) scale(0.73); z-index: 10; opacity: 0.56; }
              60.0% { transform: translate(-253px, -50.1px) scale(0.76); z-index: 11; opacity: 0.59; }
              65.0% { transform: translate(-348px, -36.4px) scale(0.8); z-index: 14; opacity: 0.64; }
              70.0% { transform: translate(-409px, -19.1px) scale(0.85); z-index: 16; opacity: 0.71; }
              75.0% { transform: translate(-430.0px, -0.0px) scale(0.91); z-index: 20; opacity: 0.78; }
              80.0% { transform: translate(-409px, 19.1px) scale(0.97); z-index: 23; opacity: 0.84; }
              85.0% { transform: translate(-348px, 36.4px) scale(1.02); z-index: 25; opacity: 0.91; }
              90.0% { transform: translate(-253px, 50.1px) scale(1.06); z-index: 28; opacity: 0.96; }
              95.0% { transform: translate(-133px, 58.9px) scale(1.09); z-index: 29; opacity: 0.99; }
              100.0% { transform: translate(-0.0px, 62.0px) scale(1.1); z-index: 30; opacity: 1.0; }
            }

            .demo-pill-btn {
              position: absolute;
              left: 50%;
              bottom: 8px;
              transform: translateX(-50%);
              padding: 20px 48px;
              border-radius: 999px;
              background: #0090AD;
              color: #ffffff !important;
              font-weight: 800;
              font-size: 26px;
              letter-spacing: 0.02em;
              white-space: nowrap;
              box-shadow: 0 4px 14px rgba(0, 0, 0, 0.35);
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
              box-shadow: 0 6px 18px rgba(0, 0, 0, 0.45);
            }
          `}</style>

          {/* Center Stage Orbit (Card background removed) */}
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
