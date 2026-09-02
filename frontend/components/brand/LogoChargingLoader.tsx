"use client";

import React from "react";
import { cn } from "@/lib/utils";

interface LogoChargingLoaderProps {
  message?: string;
  className?: string;
  fullScreen?: boolean;
  size?: number;
}

/**
 * FifthEvents Brand Charging Logo Loader
 * Plays a vibrant, continuous energy "charge up" animation through the 5-part FifthEvents emblem
 * with radiating cyan/teal/indigo glow pulses.
 */
export default function LogoChargingLoader({
  message = "Loading operations center...",
  className,
  fullScreen = false,
  size = 64,
}: LogoChargingLoaderProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center text-center select-none font-sans",
        fullScreen ? "min-h-screen w-full bg-[#F8FAFC] p-6 fixed inset-0 z-50" : "py-12 px-6",
        className
      )}
    >
      <div className="relative flex items-center justify-center">
        {/* Radiating Ambient Energy Glow Halo */}
        <div 
          className="absolute rounded-full blur-2xl -z-10 animate-pulse transition-all duration-700"
          style={{
            width: size * 2.2,
            height: size * 2.2,
            background: "radial-gradient(circle, rgba(0,180,216,0.35) 0%, rgba(45,212,191,0.2) 50%, transparent 75%)",
          }}
        />

        {/* Outer subtle orbiting ring */}
        <div
          className="absolute rounded-full border border-[#0090AD]/20 animate-spin"
          style={{
            width: size * 1.6,
            height: size * 1.6,
            animationDuration: "4s",
          }}
        />

        {/* Animated SVG Emblem with Charging Gradient Fill */}
        <svg
          width={size}
          height={size}
          viewBox="0 0 48 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="shrink-0 drop-shadow-[0_10px_25px_rgba(0,144,173,0.35)]"
        >
          <defs>
            {/* Linear gradient charging wave */}
            <linearGradient id="chargeGradient" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#2DD4BF">
                <animate
                  attributeName="offset"
                  values="0; 1; 0"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="50%" stopColor="#0090AD">
                <animate
                  attributeName="offset"
                  values="0.3; 1; 0.3"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </stop>
              <stop offset="100%" stopColor="#382C84">
                <animate
                  attributeName="offset"
                  values="0.6; 1; 0.6"
                  dur="1.8s"
                  repeatCount="indefinite"
                />
              </stop>
            </linearGradient>

            {/* Glowing filter */}
            <filter id="chargingGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.5" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. Left Vertical Pillar (Charges with Indigo) */}
          <rect 
            x="6" 
            y="8" 
            width="7.5" 
            height="32" 
            rx="3.75" 
            fill="#1C1852" 
            className="animate-pulse"
            style={{ animationDuration: "1.4s" }}
          />

          {/* 2. Top 'F' Wing (Glowing Teal Charge) */}
          <path
            d="M14 8H38C41.866 8 45 11.134 45 15C45 18.866 41.866 22 38 22H14V8Z"
            fill="#26B5BA"
            filter="url(#chargingGlow)"
          >
            <animate
              attributeName="opacity"
              values="0.45; 1; 0.45"
              dur="1.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* 3. Middle Crossbar (Royal Indigo Charge) */}
          <path
            d="M14 20H32C35.3137 20 38 22.6863 38 26C38 29.3137 35.3137 32 32 32H14V20Z"
            fill="#382C84"
          >
            <animate
              attributeName="opacity"
              values="0.35; 1; 0.35"
              dur="1.5s"
              begin="0.25s"
              repeatCount="indefinite"
            />
          </path>

          {/* 4. Lower 'E' Wing (Mint Charge) */}
          <path
            d="M14 33H35C38.866 33 42 36.134 42 40C42 43.866 38.866 47 35 47H14V33Z"
            fill="#2DD4BF"
            filter="url(#chargingGlow)"
          >
            <animate
              attributeName="opacity"
              values="0.5; 1; 0.5"
              dur="1.5s"
              begin="0.5s"
              repeatCount="indefinite"
            />
          </path>

          {/* 5. Modern Broadcast Pulse Dot */}
          <circle cx="9.75" cy="43" r="3.75" fill="#7BC043">
            <animate
              attributeName="r"
              values="3.2; 4.4; 3.2"
              dur="1.2s"
              repeatCount="indefinite"
            />
            <animate
              attributeName="opacity"
              values="0.6; 1; 0.6"
              dur="1.2s"
              repeatCount="indefinite"
            />
          </circle>
        </svg>
      </div>

      {/* Charging status message */}
      {message && (
        <div className="mt-5 space-y-1.5">
          <p className="text-xs font-semibold text-slate-700 tracking-wide font-sans flex items-center justify-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0090AD] animate-ping" />
            <span>{message}</span>
          </p>
          <p className="text-[10px] uppercase font-mono tracking-widest text-slate-400 font-semibold">
            FifthEvents Engine
          </p>
        </div>
      )}
    </div>
  );
}
