"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";

export function DemoCardAnimated() {
  return (
    <div className="relative flex-shrink-0 w-[310px] h-[310px] sm:w-[350px] sm:h-[350px] lg:w-[380px] lg:h-[380px] xl:w-[440px] xl:h-[440px] 2xl:w-[480px] 2xl:h-[480px] select-none">
      {/* 800x800 Original Sizing Canvas scaled proportionally on all screen sizes */}
      <div
        className="demo-card-root origin-top-left scale-[0.3875] sm:scale-[0.4375] lg:scale-[0.475] xl:scale-[0.55] 2xl:scale-[0.60] transition-shadow duration-300"
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
        {/* Isolated Styles for 800x800 Coordinate Space */}
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

          /* Top Wordmark in 800x800 space */
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

          /* Center Stage for Non-Interactive Semicircle Carousel */
          .carousel-stage {
            position: absolute;
            top: 365px;
            left: 50%;
            width: 0;
            height: 0;
            pointer-events: none;
          }

          /* Pure white chips with enlarged dimensions & prominent logos */
          .orbit-chip {
            position: absolute;
            top: 0;
            left: 0;
            width: 180px;
            height: 180px;
            margin-left: -90px;
            margin-top: -90px;
            border-radius: 38px;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #ffffff !important;
            border: 2.5px solid rgba(255, 255, 255, 0.98);
            box-shadow: 0 20px 44px rgba(21, 15, 69, 0.18);
            will-change: transform, opacity;
            animation: orbit-loop 14s linear infinite;
          }

          /* Continuous 3D Semicircle Orbit Loop (Mathematically Smooth) */
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

          /* High-Contrast FifthEvents Teal "Book Now" Button */
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

        {/* Top Wordmark */}
        <Link href="/products" className="demo-wordmark">
          <span>fifth<strong>Events</strong></span> — book a demo
        </Link>

        {/* ── Center Non-Interactive Semicircle Carousel Stage (7 Chips in Orbit with Enlarged Logos) ── */}
        <div className="carousel-stage">
          
          {/* Chip 0: fifthEvents (delay: 0s) - Bigger Logo */}
          <div className="orbit-chip" style={{ animationDelay: "0s" }}>
            <Image
              src="/brand/fifthevents-emblem.png"
              alt="fifthEvents"
              width={150}
              height={150}
              className="w-[88%] h-[88%] object-contain"
              priority
            />
          </div>

          {/* Chip 1: FinEdge (delay: -2s) - Bigger Logo */}
          <div className="orbit-chip" style={{ animationDelay: "-2s" }}>
            <Image
              src="/brand/finedge-logo.png"
              alt="FinEdge"
              width={160}
              height={60}
              className="w-[94%] h-auto max-h-[86%] object-contain"
              priority
            />
          </div>

          {/* Chip 2: Bulkwave (delay: -4s) - Bigger Logo */}
          <div className="orbit-chip" style={{ animationDelay: "-4s" }}>
            <Image
              src="/brand/bulkwave-icon.png"
              alt="Bulkwave"
              width={140}
              height={140}
              className="w-[85%] h-[85%] object-contain"
              priority
            />
          </div>

          {/* Chip 3: Smerp (delay: -6s) - Bigger Logo */}
          <div className="orbit-chip" style={{ animationDelay: "-6s" }}>
            <Image
              src="/brand/smerp-icon.png"
              alt="Smerp"
              width={140}
              height={140}
              className="w-[84%] h-[84%] object-contain"
              priority
            />
          </div>

          {/* Chip 4: KuleanPay (delay: -8s) - Bigger Logo */}
          <div className="orbit-chip" style={{ animationDelay: "-8s" }}>
            <Image
              src="/brand/kuleanpay-icon.png"
              alt="KuleanPay"
              width={140}
              height={140}
              className="w-[84%] h-[84%] object-contain"
              priority
            />
          </div>

          {/* Chip 5: UCP (delay: -10s) - Bigger Logo */}
          <div className="orbit-chip" style={{ animationDelay: "-10s" }}>
            <Image
              src="/brand/ucp-emblem.png"
              alt="UCP"
              width={140}
              height={140}
              className="w-[84%] h-[84%] object-contain"
              priority
            />
          </div>

          {/* Chip 6: TeXcellence (delay: -12s) - Bigger Logo */}
          <div className="orbit-chip" style={{ animationDelay: "-12s" }}>
            <Image
              src="/brand/texcellence-icon.webp"
              alt="TeXcellence"
              width={140}
              height={140}
              className="w-[84%] h-[84%] object-contain"
              priority
            />
          </div>

        </div>

        {/* ── Much Bigger "Book Now" Button in Vibrant FifthEvents Teal ── */}
        <Link href="/products" className="demo-pill-btn">
          <span>Book Now</span>
          <ArrowRight className="w-7 h-7" />
        </Link>
      </div>
    </div>
  );
}
