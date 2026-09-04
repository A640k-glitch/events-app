"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Zap,
  Building2,
  BarChart3,
  Users,
  Shield,
  Wifi,
  Cpu,
  Award,
} from "lucide-react";
import FingerprintPattern from "@/components/brand/FingerprintPattern";
import CwgLogo from "@/components/brand/CwgLogo";
import { cn } from "@/lib/utils";

// ─── FifthLab Products with Authentic thefifthlab.com Tinted Palette ─────────
const FIFTHLAB_PRODUCTS = [
  {
    id: "bulkwave",
    name: "Bulkwave",
    tagline: "Bulk Rewards & Communication Engine",
    description:
      "High-volume airtime, data, and SMS distribution platform enabling businesses to reward customers and distribute value at scale across Nigeria's telecom networks in real time.",
    url: "https://bulkwave.ng",
    logoUrl: "/brand/bulkwave-icon.png",
    accentColor: "#4F46E5",
    bgColor: "#F3F4FD",
    cardBorder: "#E0E4FB",
    badge: "Payments & Rewards",
    tags: ["Airtime Distribution", "Bulk SMS", "Data Vending", "API"],
  },
  {
    id: "finedge",
    name: "FinEdge",
    tagline: "Core Banking for Microfinance",
    description:
      "Modern cloud-native core banking solution designed for MFBs and financial institutions to streamline loan management, member savings, compliance reporting, and digital branch operations.",
    url: "https://thefifthlab.com/finedge",
    logoUrl: "/brand/finedge-logo.png",
    accentColor: "#0090AD",
    bgColor: "#EAF7F7",
    cardBorder: "#CEEFEF",
    badge: "Core Banking",
    tags: ["MFB Core", "Loan Management", "Compliance", "Digital Banking"],
  },
  {
    id: "smerp",
    name: "Smerp / SmerpGo",
    tagline: "SME & Field-Team ERP Platform",
    description:
      "Comprehensive enterprise resource planning built for SMEs and distributed field teams — covering inventory management, accounting, order tracking, and real-time operations dashboards.",
    url: "https://smerp.ng",
    logoUrl: "/brand/smerp-icon.png",
    accentColor: "#EAB308",
    bgColor: "#FAF2F7",
    cardBorder: "#F6DFEC",
    badge: "Enterprise ERP",
    tags: ["Inventory", "Accounting", "Field Teams", "Operations"],
  },
  {
    id: "ucp",
    name: "UCP",
    tagline: "Unified Cooperative Platform",
    description:
      "Digital-first platform to manage cooperative societies end-to-end — member record-keeping, contribution tracking, loan processing, and governance workflows all in one unified system.",
    url: "https://thefifthlab.com/ucp",
    logoUrl: "/brand/ucp-emblem.png",
    accentColor: "#7C3AED",
    bgColor: "#F5F3FF",
    cardBorder: "#E4DEFD",
    badge: "Cooperative Tech",
    tags: ["Member Records", "Contributions", "Loan Processing", "Governance"],
  },
  {
    id: "kuleanpay",
    name: "KuleanPay",
    tagline: "AI-Driven Escrow & Secure Payments",
    description:
      "Secure, AI-powered escrow payment engine that protects buyers and sellers in high-value transactions — reducing fraud risk and enabling trust-based commerce across Africa.",
    url: "https://kuleanpay.com",
    logoUrl: "/brand/kuleanpay-icon.png",
    accentColor: "#1E3A8A",
    bgColor: "#F0F6FF",
    cardBorder: "#D8E6FA",
    badge: "Secure Payments",
    tags: ["Escrow", "AI Fraud Detection", "Secure Commerce", "API"],
  },
  {
    id: "beetvas",
    name: "BeetVAS",
    tagline: "High-Performance Value-Added Services",
    description:
      "Enterprise-grade VAS engine for telcos and aggregators delivering high-throughput airtime and data vending, real-time reconciliation, and white-label reseller infrastructure.",
    url: "https://thefifthlab.com/beetvas",
    logoUrl: "/brand/beetvaslogo.png",
    accentColor: "#DC2626",
    bgColor: "#FFF5F5",
    cardBorder: "#FED7D7",
    badge: "Telecom VAS",
    tags: ["Airtime Vending", "White-Label", "Reconciliation", "Telco API"],
  },
];

// ─── CWG PLC Products & Services (Clean White, TeXcellence Tinted) ─────────
const CWG_PRODUCTS = [
  {
    id: "cwg-cloud",
    name: "CWG Cloud Services",
    tagline: "Scalable Cloud Infrastructure & ERP-in-Cloud",
    description:
      "Enterprise-grade cloud services including Infrastructure-as-a-Service, cloud ERP for SMEs, and cloud-based core banking for financial institutions across Africa.",
    url: "https://cwg-plc.com/services/cloud-services",
    logoUrl: "/brand/cwg/cloud.svg",
    accentColor: "#0369A1",
    neutralHover: true,
    badge: "Cloud Services",
    tags: ["IaaS", "ERP Cloud", "Banking Cloud", "Colocation"],
  },
  {
    id: "cwg-managed",
    name: "CWG Managed Services",
    tagline: "Outsourced IT & Infrastructure Management",
    description:
      "End-to-end outsourced IT management covering network infrastructure, data center operations, security management, LAN/WAN, and application support.",
    url: "https://cwg-plc.com/services/managed-services",
    logoUrl: "/brand/cwg/managed.svg",
    accentColor: "#475569",
    neutralHover: true,
    badge: "Managed IT",
    tags: ["Network Ops", "Data Center", "Security", "24/7 Monitoring"],
  },
  {
    id: "cwg-payments",
    name: "Payment Terminal Solutions",
    tagline: "Point-of-Sale Hardware & Merchant Terminals",
    description:
      "Reliable and secure payment terminal systems and merchant acquiring infrastructure tailored for financial service institutions and retail enterprises.",
    url: "https://cwg-plc.com/services/payment-terminal-solution",
    logoUrl: "/brand/cwg/payments.svg",
    accentColor: "#0284C7",
    neutralHover: true,
    badge: "Terminal Solutions",
    tags: ["POS Terminals", "Merchant Acquiring", "Card Processing", "Fintech"],
  },
  {
    id: "cwg-infra",
    name: "IT Infrastructure Services",
    tagline: "Data Center, Hardware & Architecture",
    description:
      "High-availability enterprise computing hardware, enterprise storage networks, power backup systems, and comprehensive data center integration.",
    url: "https://cwg-plc.com/services/it-infrastructure",
    logoUrl: "/brand/cwg/infrastructure.svg",
    accentColor: "#0F766E",
    neutralHover: true,
    badge: "Infrastructure",
    tags: ["Data Center", "Hardware Architecture", "Networking", "Storage"],
  },
  {
    id: "cwg-software",
    name: "Enterprise Software Services",
    tagline: "Custom Development, Integration & QA",
    description:
      "Bespoke software architecture, core integration, and quality assurance services powering Tier-1 banks, telcos, and government agencies.",
    url: "https://cwg-plc.com/services/software-services",
    logoUrl: "/brand/cwg/software.svg",
    accentColor: "#7C3AED",
    neutralHover: true,
    badge: "Custom Software",
    tags: ["Custom Dev", "Core Integration", "Quality Assurance", "APIs"],
  },
  {
    id: "cwg-training",
    name: "CWG Training Academy",
    tagline: "IT Professional Certification & Development",
    description:
      "Professional IT training and certification programs for enterprise technologists — covering cloud, cybersecurity, networking, and the CWG Tech Community.",
    url: "https://cwg-plc.com/services/training",
    logoUrl: "/brand/cwg/training.svg",
    accentColor: "#16A34A",
    neutralHover: true,
    badge: "Training & Certs",
    tags: ["Certification", "Cloud Training", "Cybersecurity", "Tech Community"],
  },
  {
    id: "texcellence",
    name: "The TeXcellence Conference",
    tagline: "Future-Forward Pan-African Tech Summit & Awards",
    description:
      "CWG's flagship annual technology summit and awards ceremony, recognising outstanding innovation and digital transformation achievements across Nigeria and Africa.",
    url: "https://thetexcellenceconference.com/",
    logoUrl: "/brand/texcellence-logo.png",
    accentColor: "#1E2A78",
    bgColor: "#EEF2FF",
    cardBorder: "#C7D2FE",
    neutralHover: false,
    badge: "Annual Summit",
    tags: ["Annual Summit", "Innovation", "Pan-African", "Tech Awards"],
  },
  {
    id: "cwg-atm",
    name: "ATM Management Services",
    tagline: "Full-Lifecycle Self-Service Banking Terminals",
    description:
      "Comprehensive automated teller machine deployment, preventative maintenance, cash replenishment logistics, and uptime engineering across West Africa.",
    url: "https://cwg-plc.com/services/atm-management",
    logoUrl: "/brand/cwg/atm.svg",
    accentColor: "#4B5563",
    neutralHover: true,
    badge: "Self-Service",
    tags: ["ATM Fleets", "Uptime Engineering", "Banking Hardware", "Maintenance"],
  },
];

// ─── Reusable Product Card ────────────────────────────────────────────────────
interface ProductCardProps {
  id?: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  logoUrl?: string;
  accentColor: string;
  bgColor?: string;
  cardBorder?: string;
  neutralHover?: boolean;
  bgGradient?: string;
  borderColor?: string;
  Icon?: React.ElementType;
  badge?: string;
  tags: string[];
  className?: string;
  onCardClick?: (e: React.MouseEvent) => void;
}

function ProductCard({
  id,
  name,
  tagline,
  description,
  url,
  logoUrl,
  accentColor,
  bgColor,
  cardBorder,
  neutralHover,
  Icon,
  tags,
  className,
  onCardClick,
}: ProductCardProps) {
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onCardClick) onCardClick(e);
    if (url && !e.defaultPrevented) {
      window.open(url, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          if (url) window.open(url, "_blank", "noopener,noreferrer");
        }
      }}
      style={{
        backgroundColor: bgColor || "#FFFFFF",
        borderColor: cardBorder || "rgba(226, 232, 240, 0.9)",
        ["--card-accent" as string]: accentColor,
      }}
      className={cn(
        neutralHover ? "product-card-neutral" : "product-card",
        "group relative rounded-3xl p-6 sm:p-7 flex flex-col justify-between gap-4 border shadow-[0_2px_12px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] hover:-translate-y-1 transition-all duration-300 cursor-pointer text-left select-none",
        className
      )}
    >
      <div className="space-y-4">
        {/* Top Row: Clean Logo without container */}
        <div className="flex items-center justify-between gap-4 min-h-[52px]">
          <div className="flex items-center justify-start shrink-0">
            {logoUrl ? (
              <img
                src={logoUrl}
                alt={name}
                className="h-12 sm:h-14 w-auto max-w-[190px] object-contain object-left shrink-0 transition-transform duration-200 group-hover:scale-105"
              />
            ) : Icon ? (
              <Icon
                className="w-10 h-10 shrink-0 transition-transform duration-200 group-hover:scale-105"
                style={{ color: accentColor }}
              />
            ) : null}
          </div>

          <div className="product-arrow w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/80 border border-black/[0.06] text-slate-400 group-hover:text-slate-900 transition-colors shadow-2xs">
            <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </div>
        </div>

        {/* Name & Tagline */}
        <div className="space-y-1">
          <h3 className="product-title text-lg font-bold tracking-tight text-slate-950">
            {name}
          </h3>
          <p className="text-xs sm:text-sm font-semibold text-slate-700">
            {tagline}
          </p>
        </div>

        {/* Description */}
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
          {description}
        </p>
      </div>

      {/* Bottom Row: Tags + thefifthlab.com Signature Black Pill Button */}
      <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between gap-3">
        <div className="flex flex-wrap gap-1.5">
          {tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="text-[10.5px] font-medium text-slate-700 bg-white/90 border border-black/[0.06] px-2.5 py-0.5 rounded-md shadow-2xs"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/demo?product=${id || name.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-full bg-[#0090AD] hover:bg-[#007b94] text-white text-[11px] font-bold shadow-xs hover:scale-105 transition-all"
          >
            Book Demo
          </Link>
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-950 text-white text-[11px] font-semibold group-hover:bg-black transition-all shrink-0 shadow-sm group-hover:scale-105">
            <span>Details</span>
            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── High-Performance GPU-Accelerated Draggable Continuous Marquee ───────────
interface ProductItem {
  id: string;
  name: string;
  tagline: string;
  description: string;
  url: string;
  logoUrl?: string;
  accentColor: string;
  bgColor?: string;
  cardBorder?: string;
  neutralHover?: boolean;
  badge?: string;
  tags: string[];
}

interface DraggableMarqueeProps {
  items: ProductItem[];
  direction?: "left" | "right";
  speed?: number;
}

function DraggableMarquee({
  items,
  direction = "left",
  speed = 1.35,
}: DraggableMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isMouseDownRef = useRef(false);
  const startXRef = useRef(0);
  const startPosRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const posRef = useRef(0);
  const singleSetWidthRef = useRef(0);

  // 4x duplication for unbroken infinite looping
  const quadrupledItems = [...items, ...items, ...items, ...items];

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    // Cache single set width once, avoiding layout thrashing inside animation loop
    const measure = () => {
      if (track) {
        singleSetWidthRef.current = track.scrollWidth / 4;
        if (direction === "right" && posRef.current === 0) {
          posRef.current = -singleSetWidthRef.current;
          track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
        }
      }
    };

    measure();
    window.addEventListener("resize", measure);

    let animationFrameId: number;

    const step = () => {
      if (!isHoveredRef.current && !isMouseDownRef.current && track) {
        const setWidth = singleSetWidthRef.current;
        if (setWidth > 0) {
          if (direction === "left") {
            posRef.current -= speed;
            if (posRef.current <= -setWidth * 2) {
              posRef.current += setWidth;
            }
          } else {
            posRef.current += speed;
            if (posRef.current >= 0) {
              posRef.current -= setWidth;
            }
          }
          track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
        }
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, speed, items.length]);

  const handleMouseDown = (e: React.MouseEvent) => {
    isMouseDownRef.current = true;
    startXRef.current = e.clientX;
    startPosRef.current = posRef.current;
    dragDistanceRef.current = 0;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grabbing";
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isMouseDownRef.current || !trackRef.current) return;
    const deltaX = e.clientX - startXRef.current;
    dragDistanceRef.current = Math.abs(deltaX);
    posRef.current = startPosRef.current + deltaX * 1.25;

    const setWidth = singleSetWidthRef.current;
    if (setWidth > 0) {
      while (posRef.current <= -setWidth * 2) {
        posRef.current += setWidth;
        startPosRef.current += setWidth;
      }
      while (posRef.current >= 0) {
        posRef.current -= setWidth;
        startPosRef.current -= setWidth;
      }
    }

    trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
  };

  const handleMouseUpOrLeave = () => {
    isMouseDownRef.current = false;
    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (!trackRef.current) return;
    const delta = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    posRef.current -= delta * 0.9;

    const setWidth = singleSetWidthRef.current;
    if (setWidth > 0) {
      while (posRef.current <= -setWidth * 2) {
        posRef.current += setWidth;
      }
      while (posRef.current >= 0) {
        posRef.current -= setWidth;
      }
    }

    trackRef.current.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
  };

  return (
    <div
      className="relative mt-8 overflow-hidden w-full select-none"
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        handleMouseUpOrLeave();
      }}
    >
      {/* Subtle Gradient Edge Fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-[#F8FAFC] to-transparent z-20" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-[#F8FAFC] to-transparent z-20" />

      {/* Interactive Drag & Wheel Viewport */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUpOrLeave}
        onWheel={handleWheel}
        className="overflow-hidden py-3 w-full cursor-grab active:cursor-grabbing"
      >
        <div
          ref={trackRef}
          className="flex gap-5 py-2 w-max will-change-transform"
        >
          {quadrupledItems.map((p, idx) => (
            <ProductCard
              key={`${direction}-${p.id}-${idx}`}
              {...p}
              className="w-[330px] sm:w-[380px] shrink-0"
              onCardClick={(e) => {
                if (dragDistanceRef.current > 6) {
                  e.preventDefault();
                }
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  return (
    <div className="min-h-screen text-[#111827] font-sans">

      {/* ── Hero Header with Biometric Dark Theme & Dense Fingerprints ── */}
      <section className="relative pt-32 sm:pt-36 pb-16 px-4 sm:px-6 lg:px-8 border-b border-white/[0.08] bg-[#06090e] bg-gradient-to-b from-[#090e17] via-[#06090e] to-[#030508] overflow-hidden text-white">
        
        {/* Soft Radial Ambient Cyan Glow */}
        <div className="absolute -right-24 -top-24 w-[480px] h-[480px] bg-[#26B5BA]/12 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -left-32 -bottom-28 w-[380px] h-[380px] bg-[#0090AD]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Multiple Dense Fingerprint Vectors Across Background */}
        <FingerprintPattern
          size={700}
          opacity={0.38}
          className="absolute -right-20 -top-36 text-[#26B5BA] rotate-12 pointer-events-none"
        />
        <FingerprintPattern
          size={540}
          opacity={0.25}
          className="absolute right-52 -bottom-40 text-[#30B5C1] -rotate-12 pointer-events-none"
        />
        <FingerprintPattern
          size={480}
          opacity={0.18}
          className="absolute -left-24 -top-28 text-white -rotate-45 pointer-events-none"
        />
        <FingerprintPattern
          size={440}
          opacity={0.16}
          className="absolute -left-28 -bottom-36 text-[#26B5BA] rotate-45 pointer-events-none"
        />
        <FingerprintPattern
          size={380}
          opacity={0.10}
          className="absolute left-1/2 -top-32 text-white rotate-12 pointer-events-none"
        />

        <div className="max-w-6xl mx-auto space-y-6 text-left relative z-10">
          <div className="space-y-3">
            <span className="text-xs uppercase tracking-widest font-mono text-[#26B5BA]">
              <span className="font-bold">FIFTH</span><span className="font-light">LAB</span> &amp; CWG PLC ECOSYSTEM
            </span>
            <h1
              className="font-semibold tracking-tight text-white"
              style={{ fontSize: "clamp(28px, 4vw, 52px)", lineHeight: 1.12 }}
            >
              Products powering{" "}
              <span className="text-[#26B5BA]">Africa&apos;s digital</span>{" "}
              transformation.
            </h1>
            <p className="text-sm text-slate-300 max-w-2xl leading-relaxed">
              From fintech infrastructure and cooperative platforms to enterprise cloud services and
              bulk payment engines — explore the full suite of solutions built by <span className="text-white tracking-tight"><strong className="font-bold">fifth</strong><span className="font-light">lab</span></span> and
              CWG PLC.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-6 pt-2">
            <a
              href="https://thefifthlab.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit The FifthLab website"
              title="Visit TheFifthLab.com"
              className="inline-flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <img
                src="/favicon.ico"
                alt="The FifthLab"
                className="h-8 sm:h-9 w-auto object-contain"
              />
            </a>
            <a
              href="https://cwg-plc.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Visit CWG PLC website"
              title="Visit CWG-PLC.com"
              className="inline-flex items-center justify-center transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            >
              <CwgLogo className="h-9 sm:h-10 w-auto text-white" />
            </a>
            <Link
              href="/demo"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full bg-[#26B5BA] hover:bg-[#209fa3] text-slate-950 text-xs font-bold transition-all hover:scale-[1.02] active:scale-[0.98] shadow-md shadow-[#26B5BA]/20"
            >
              Book a Product Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ── FifthLab Products Carousel (Direction: Left ←) ─────────────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden bg-[#F8FAFC]">
        {/* Subtle Ambient Fingerprints */}
        <FingerprintPattern
          size={620}
          opacity={0.04}
          className="absolute -right-36 top-16 text-[#0090AD] rotate-45 pointer-events-none"
        />
        <FingerprintPattern
          size={560}
          opacity={0.03}
          className="absolute -left-36 bottom-16 text-slate-900 -rotate-12 pointer-events-none"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          {/* Section header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a
                href="https://thefifthlab.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit The FifthLab website"
                title="Visit TheFifthLab.com"
                className="shrink-0 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <img
                  src="/brand/fifthlab-logo.png"
                  alt="The FifthLab"
                  className="h-9 sm:h-10 w-auto object-contain"
                />
              </a>
              <div>
                <div className="text-[11px] uppercase tracking-widest font-mono text-[#0090AD]">
                  <span className="font-bold">FIFTH</span><span className="font-light">LAB</span> Products
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                  Fintech &amp; Enterprise Software Suite
                </h2>
              </div>
            </div>

            {/* Direct Link */}
            <div className="ml-auto hidden sm:block">
              <a
                href="https://thefifthlab.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#0090AD] hover:text-[#007A94] transition-colors group"
              >
                <img
                  src="/brand/fifthlab-logo.png"
                  alt="The FifthLab"
                  className="h-4 w-auto object-contain"
                />
                <span className="tracking-tight"><span className="font-bold">fifth</span><span className="font-light">lab</span>.com</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Continuous Marquee */}
        <DraggableMarquee items={FIFTHLAB_PRODUCTS} direction="left" speed={1.35} />
      </section>

      {/* Divider */}
      <div className="px-4 sm:px-6 lg:px-8 bg-[#F8FAFC]">
        <div className="max-w-7xl mx-auto border-t border-slate-200/80" />
      </div>

      {/* ── CWG PLC Products Carousel (Direction: Right →) ─────────────────────────────────────────── */}
      <section className="py-16 relative overflow-hidden bg-[#F8FAFC]">
        {/* Subtle Ambient Fingerprints */}
        <FingerprintPattern
          size={600}
          opacity={0.04}
          className="absolute -left-32 top-20 text-[#0369A1] -rotate-45 pointer-events-none"
        />
        <FingerprintPattern
          size={540}
          opacity={0.03}
          className="absolute -right-32 bottom-20 text-slate-900 rotate-12 pointer-events-none"
        />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6 relative z-10">
          {/* Section header */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <a
                href="https://cwg-plc.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Visit CWG PLC website"
                title="Visit CWG-PLC.com"
                className="shrink-0 flex items-center justify-center hover:scale-105 transition-transform"
              >
                <CwgLogo className="h-10 w-auto text-[#162054]" />
              </a>
              <div>
                <div className="text-[11px] font-bold text-[#162054] uppercase tracking-widest font-mono">
                  CWG PLC
                </div>
                <h2 className="text-xl sm:text-2xl font-semibold text-slate-900 tracking-tight">
                  ICT Infrastructure &amp; Services
                </h2>
              </div>
            </div>

            {/* Direct Link */}
            <div className="ml-auto hidden sm:block">
              <a
                href="https://cwg-plc.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-[#162054] hover:text-white bg-[#162054]/5 hover:bg-[#162054] border border-[#162054]/15 transition-all group"
              >
                <CwgLogo className="h-3.5 w-auto text-[#162054] group-hover:text-white transition-colors" />
                <span>cwg-plc.com</span>
                <ArrowUpRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-white transition-colors" />
              </a>
            </div>
          </div>
        </div>

        {/* Interactive Continuous Marquee in Counter Direction */}
        <DraggableMarquee items={CWG_PRODUCTS} direction="right" speed={1.35} />
      </section>

      {/* ── Bottom CTA ────────────────────────────────────────────────────── */}
      <section className="mx-4 sm:mx-6 lg:mx-8 mt-16 sm:mt-24 mb-20 rounded-3xl pt-16 sm:pt-20 pb-14 sm:pb-16 px-8 text-center space-y-5 relative overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(135deg, rgba(10,13,20,0.96) 0%, rgba(28,24,82,0.94) 100%)",
          border: "1px solid rgba(255,255,255,0.1)",
        }}
      >
        {/* Ambient glow */}
        <div
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            background: "radial-gradient(ellipse 60% 50% at 50% 50%, rgba(0,144,173,0.15), transparent)",
          }}
        />

        {/* Dense Biometric Fingerprint Vectors gracefully positioned inside banner */}
        <FingerprintPattern
          size={500}
          opacity={0.22}
          className="absolute -left-16 top-4 sm:top-6 text-[#30B5C1] -rotate-12 pointer-events-none"
        />
        <FingerprintPattern
          size={540}
          opacity={0.18}
          className="absolute -right-24 bottom-2 text-[#26B5BA] rotate-12 pointer-events-none"
        />

        <div className="relative z-10 space-y-5">
          <div className="text-[11px] font-mono tracking-widest uppercase text-[#30B5C1]">
            <span className="font-bold">FIFTH</span><span className="font-light">EVENTS</span> × <span className="font-bold">FIFTH</span><span className="font-light">LAB</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold text-white tracking-tight">
            See these products live at our summits
          </h2>
          <p className="text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
            Book a 1-on-1 executive demo, attend a keynote showcase, or claim a delegate pass for
            the next <span className="tracking-tight text-white"><strong className="font-bold">fifth</strong><span className="font-light">lab</span></span>-hosted summit event.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/demo"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#0090AD] hover:bg-[#007A94] text-white font-semibold text-sm transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg"
            >
              Book Executive Demo
            </Link>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full border border-white/20 text-white/90 font-semibold text-sm hover:bg-white/10 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
              View Summit Schedule
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
