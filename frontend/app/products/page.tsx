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
  CheckCircle2,
  X,
  ExternalLink,
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
    features: [
      "High-throughput multi-telco airtime and data distribution",
      "Bulk SMS and transaction notification gateway",
      "Automated real-time reconciliation and corporate disbursement ledger",
      "Plug-and-play REST APIs with 99.9% uptime SLA"
    ],
  },
  {
    id: "finedge",
    name: "FinEdge",
    tagline: "Core Banking for Microfinance",
    description:
      "Modern cloud-native core banking solution designed for MFBs and financial institutions to streamline loan management, member savings, compliance reporting, and digital branch operations.",
    url: "https://thefifthlab.com",
    logoUrl: "/brand/finedge-logo.png",
    accentColor: "#0090AD",
    bgColor: "#EAF7F7",
    cardBorder: "#CEEFEF",
    badge: "Core Banking",
    tags: ["MFB Core", "Loan Management", "Compliance", "Digital Banking"],
    features: [
      "Cloud-native core banking engine built specifically for MFBs",
      "Automated loan origination, credit scoring and repayment tracking",
      "Central Bank and regulatory compliance reporting built-in",
      "Digital branchless banking and agency banking enablement"
    ],
  },
  {
    id: "smerp",
    name: "Smerp / SmerpGo",
    tagline: "SME & Field-Team ERP Platform",
    description:
      "Comprehensive enterprise resource planning built for SMEs and distributed field teams, covering inventory management, accounting, order tracking, and real-time operations dashboards.",
    url: "https://smerp.ng",
    logoUrl: "/brand/smerp-icon.png",
    accentColor: "#EAB308",
    bgColor: "#FAF2F7",
    cardBorder: "#F6DFEC",
    badge: "Enterprise ERP",
    tags: ["Inventory", "Accounting", "Field Teams", "Operations"],
    features: [
      "End-to-end ERP: inventory, accounting, sales and procurement",
      "Field agent tracking and mobile point-of-sale operations",
      "Multi-warehouse stock alerts and replenishment automation",
      "Executive business intelligence and real-time financial reporting"
    ],
  },
  {
    id: "ucp",
    name: "UCP",
    tagline: "Unified Cooperative Platform",
    description:
      "Digital-first platform to manage cooperative societies end-to-end, including member record-keeping, contribution tracking, loan processing, and governance workflows all in one unified system.",
    url: "https://thefifthlab.com",
    logoUrl: "/brand/ucp-emblem.png",
    accentColor: "#7C3AED",
    bgColor: "#F5F3FF",
    cardBorder: "#E4DEFD",
    badge: "Cooperative Tech",
    tags: ["Member Records", "Contributions", "Loan Processing", "Governance"],
    features: [
      "Complete membership management and digital passbooks",
      "Automated contribution ledgers and dividend calculations",
      "Cooperative loan eligibility appraisal and automated deductions",
      "Democratic voting, resolutions and annual general meeting workflows"
    ],
  },
  {
    id: "kuleanpay",
    name: "KuleanPay",
    tagline: "AI-Driven Escrow & Secure Payments",
    description:
      "Secure, AI-powered escrow payment engine that protects buyers and sellers in high-value transactions, reducing fraud risk and enabling trust-based commerce across Africa.",
    url: "https://kuleanpay.com",
    logoUrl: "/brand/kuleanpay-icon.png",
    accentColor: "#1E3A8A",
    bgColor: "#F0F6FF",
    cardBorder: "#D8E6FA",
    badge: "Secure Payments",
    tags: ["Escrow", "AI Fraud Detection", "Secure Commerce", "API"],
    features: [
      "AI-driven milestone escrow protection for high-value commerce",
      "Multi-channel pay-in and instant settlement payout rails",
      "Automated fraud mitigation and identity verification checks",
      "Enterprise checkout SDKs and merchant dispute resolution"
    ],
  },
  {
    id: "beetvas",
    name: "BeetVAS",
    tagline: "High-Performance Value-Added Services",
    description:
      "Enterprise-grade VAS engine for telcos and aggregators delivering high-throughput airtime and data vending, real-time reconciliation, and white-label reseller infrastructure.",
    url: "https://thefifthlab.com",
    logoUrl: "/brand/beetvaslogo.png",
    accentColor: "#DC2626",
    bgColor: "#FFF5F5",
    cardBorder: "#FED7D7",
    badge: "Telecom VAS",
    tags: ["Airtime Vending", "White-Label", "Reconciliation", "Telco API"],
    features: [
      "Enterprise value-added services aggregation engine",
      "Utility bills, airtime, data and digital content vending APIs",
      "White-label reseller portals and sub-agent commission management",
      "High concurrency architecture handling tens of thousands of requests/sec"
    ],
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
    features: [
      "Tier III sovereign datacenter hosting and disaster recovery",
      "Infrastructure-as-a-Service (IaaS) and hybrid cloud architecture",
      "Cloud ERP and banking workload hosting with 99.98% uptime",
      "Regulatory data residency and stringent enterprise security compliance"
    ],
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
    features: [
      "24/7/365 Network Operations Center (NOC) monitoring and management",
      "Complete enterprise IT infrastructure outsourcing",
      "Proactive threat detection, vulnerability response and compliance audits",
      "Dedicated SLAs with rapid incident response and recovery"
    ],
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
    features: [
      "Smart Android POS hardware with EMV Level 1 & 2 compliance",
      "Multi-rail payment processing: Chip, PIN, Contactless and QR codes",
      "Comprehensive terminal management system (TMS) with remote updates",
      "Direct acquiring integration with major commercial banks"
    ],
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
    features: [
      "Mission-critical enterprise server and mainframe architecture",
      "Enterprise Storage Area Networks (SAN) and high-speed data backup",
      "Precision cooling, smart UPS and green data center engineering",
      "Structured cabling, software-defined WAN and campus network design"
    ],
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
    features: [
      "Bespoke enterprise application development and legacy modernization",
      "Enterprise middleware, message bus and core banking integrations",
      "Rigorous automated QA, performance benchmarking and penetration testing",
      "Agile delivery with dedicated on-site and remote engineering squads"
    ],
  },
  {
    id: "cwg-training",
    name: "CWG Training Academy",
    tagline: "IT Professional Certification & Development",
    description:
      "Professional IT training and certification programs for enterprise technologists, covering cloud, cybersecurity, networking, and the CWG Tech Community.",
    url: "https://cwg-plc.com/services/training",
    logoUrl: "/brand/cwg/training.svg",
    accentColor: "#16A34A",
    neutralHover: true,
    badge: "Training & Certs",
    tags: ["Certification", "Cloud Training", "Cybersecurity", "Tech Community"],
    features: [
      "Vendor-accredited certification courses (AWS, Microsoft, Cisco, etc.)",
      "Hands-on practical enterprise labs and instructor-led masterclasses",
      "Customized corporate training packages for enterprise IT teams",
      "Direct pathway to the CWG talent alumni network"
    ],
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
    features: [
      "Keynote addresses from leading continental business and government luminaries",
      "Executive C-suite roundtables on AI, FinTech and Digital Governance",
      "Prestigious Pan-African Tech Excellence Awards ceremony",
      "Direct exhibition floor showcasing disruptive African enterprise solutions"
    ],
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
    features: [
      "Full lifecycle ATM deployment, commissioning and terminal staging",
      "Preventative maintenance and 24/7 West African field engineer support",
      "Biometric and cash-recycling multi-currency self-service terminals",
      "High availability monitoring with over 98.5% uptime guarantee"
    ],
  },
];

// ─── Product Data Types ───────────────────────────────────────────────────────
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
  features?: string[];
}

// ─── Reusable Product Card ────────────────────────────────────────────────────
interface ProductCardProps {
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
  Icon?: React.ElementType;
  badge?: string;
  tags: string[];
  features?: string[];
  className?: string;
  onSelect?: () => void;
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
  onSelect,
  onCardClick,
}: ProductCardProps) {
  const handleCardClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (onCardClick) onCardClick(e);
    if (!e.defaultPrevented && onSelect) {
      onSelect();
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
          if (onSelect) onSelect();
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

          <button
            type="button"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (onSelect) onSelect();
            }}
            aria-label={`View ${name} details`}
            className="product-arrow w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-white/80 border border-black/[0.06] text-slate-400 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
          >
            <ArrowUpRight className="w-4 h-4 transition-transform hover:translate-x-0.5 hover:-translate-y-0.5" />
          </button>
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

      {/* Bottom Row: Tags + Actions */}
      <div className="pt-4 border-t border-black/[0.06] flex items-center justify-between gap-2">
        <div className="flex flex-wrap gap-1 min-w-0 flex-1 overflow-hidden">
          {tags.slice(0, 1).map((tag) => (
            <span
              key={tag}
              className="text-[10px] sm:text-[10.5px] font-medium text-slate-700 bg-white/90 border border-black/[0.06] px-2 py-0.5 rounded-md shadow-2xs whitespace-nowrap"
            >
              {tag}
            </span>
          ))}
          {tags.length > 1 && (
            <span className="hidden sm:inline-flex text-[10px] sm:text-[10.5px] font-medium text-slate-700 bg-white/90 border border-black/[0.06] px-2 py-0.5 rounded-md shadow-2xs whitespace-nowrap">
              {tags[1]}
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
          <Link
            href={`/demo?product=${id || name.toLowerCase().replace(/[^a-z0-9]/g, "")}`}
            onClick={(e: React.MouseEvent) => e.stopPropagation()}
            className="inline-flex items-center justify-center px-3 py-1.5 rounded-full bg-[#0090AD] hover:bg-[#007b94] text-white text-[11px] font-bold shadow-xs hover:scale-105 transition-all whitespace-nowrap shrink-0"
          >
            <span>Book Demo</span>
          </Link>
          <button
            type="button"
            onClick={(e: React.MouseEvent) => {
              e.stopPropagation();
              if (onSelect) onSelect();
            }}
            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full bg-slate-950 text-white text-[11px] font-semibold hover:bg-black transition-all shrink-0 shadow-sm hover:scale-105 whitespace-nowrap cursor-pointer"
          >
            <span>Details</span>
            <ArrowUpRight className="w-3 h-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── High-Performance GPU-Accelerated Draggable Continuous Marquee ───────────
interface DraggableMarqueeProps {
  items: ProductItem[];
  direction?: "left" | "right";
  speed?: number;
  onSelectProduct?: (product: ProductItem) => void;
}

function DraggableMarquee({
  items,
  direction = "left",
  speed = 1.35,
  onSelectProduct,
}: DraggableMarqueeProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const isHoveredRef = useRef(false);
  const isDownRef = useRef(false);
  const isDraggingRef = useRef(false);
  const hasDraggedRef = useRef(false);
  const startXRef = useRef(0);
  const startYRef = useRef(0);
  const startPosRef = useRef(0);
  const dragDistanceRef = useRef(0);
  const isHorizontalDragRef = useRef<boolean | null>(null);
  const lastTimeRef = useRef(0);
  const lastXRef = useRef(0);
  const velocityRef = useRef(0);
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
      if (!isHoveredRef.current && !isDraggingRef.current && track) {
        // Apply residual velocity deceleration after a hand flick
        if (Math.abs(velocityRef.current) > 0.05) {
          posRef.current += velocityRef.current;
          velocityRef.current *= 0.94; // smooth inertia decay
        } else {
          velocityRef.current = 0;
          const setWidth = singleSetWidthRef.current;
          if (setWidth > 0) {
            if (direction === "left") {
              posRef.current -= speed;
            } else {
              posRef.current += speed;
            }
          }
        }

        const setWidth = singleSetWidthRef.current;
        if (setWidth > 0) {
          while (posRef.current <= -setWidth * 2) {
            posRef.current += setWidth;
          }
          while (posRef.current >= 0) {
            posRef.current -= setWidth;
          }
        }

        track.style.transform = `translate3d(${posRef.current}px, 0, 0)`;
      }
      animationFrameId = requestAnimationFrame(step);
    };

    animationFrameId = requestAnimationFrame(step);

    return () => {
      window.removeEventListener("resize", measure);
      cancelAnimationFrame(animationFrameId);
    };
  }, [direction, speed, items.length]);

  // Pointer event handlers — Unified for Desktop Mouse and Mobile Touch
  const handlePointerDown = (e: React.PointerEvent) => {
    if (e.button !== 0) return;
    isDownRef.current = true;
    isDraggingRef.current = false;
    hasDraggedRef.current = false;
    startXRef.current = e.clientX;
    startYRef.current = e.clientY;
    lastXRef.current = e.clientX;
    lastTimeRef.current = performance.now();
    startPosRef.current = posRef.current;
    dragDistanceRef.current = 0;
    isHorizontalDragRef.current = null;
    velocityRef.current = 0;
    // CRITICAL: Do NOT call setPointerCapture on pointerdown!
    // Capturing pointer immediately prevents native click dispatches on desktop links/buttons.
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDownRef.current || !trackRef.current) return;

    const deltaX = e.clientX - startXRef.current;
    const deltaY = e.clientY - startYRef.current;
    const totalDist = Math.hypot(deltaX, deltaY);

    // Only engage drag if movement exceeds desktop threshold (> 7px)
    if (!isDraggingRef.current) {
      if (totalDist < 7) {
        return; // Plain click or resting mouse jitter
      }
      isDraggingRef.current = true;
      hasDraggedRef.current = true;
      if (containerRef.current) {
        containerRef.current.style.cursor = "grabbing";
        try {
          containerRef.current.setPointerCapture(e.pointerId);
        } catch {
          // ignore
        }
      }
    }

    // Detect gesture intent: horizontal marquee drag vs vertical page scroll
    if (isHorizontalDragRef.current === null) {
      isHorizontalDragRef.current = Math.abs(deltaX) >= Math.abs(deltaY);
    }

    if (isHorizontalDragRef.current === false) {
      return;
    }

    const now = performance.now();
    const dt = now - lastTimeRef.current;
    if (dt > 0) {
      const stepDelta = e.clientX - lastXRef.current;
      velocityRef.current = (stepDelta / dt) * 16.6; // normalized velocity
      lastXRef.current = e.clientX;
      lastTimeRef.current = now;
    }

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

  const handlePointerUpOrCancel = (e: React.PointerEvent) => {
    if (!isDownRef.current) return;

    if (containerRef.current && containerRef.current.hasPointerCapture(e.pointerId)) {
      try {
        containerRef.current.releasePointerCapture(e.pointerId);
      } catch {
        // ignore
      }
    }

    if (containerRef.current) {
      containerRef.current.style.cursor = "grab";
    }

    // Delay reset slightly so click handlers can check if a real drag occurred
    setTimeout(() => {
      isDownRef.current = false;
      isDraggingRef.current = false;
      hasDraggedRef.current = false;
      dragDistanceRef.current = 0;
      isHorizontalDragRef.current = null;
    }, 60);
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
        if (isDraggingRef.current) {
          isDraggingRef.current = false;
          isDownRef.current = false;
        }
      }}
    >
      {/* Subtle Gradient Edge Fades */}
      <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-r from-[#F8FAFC] to-transparent z-20" />
      <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-10 sm:w-20 bg-gradient-to-l from-[#F8FAFC] to-transparent z-20" />

      {/* Interactive Drag & Wheel Viewport */}
      <div
        ref={containerRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUpOrCancel}
        onPointerCancel={handlePointerUpOrCancel}
        onWheel={handleWheel}
        className="overflow-hidden py-3 w-full cursor-grab active:cursor-grabbing touch-pan-y select-none"
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
              onSelect={() => onSelectProduct && onSelectProduct(p)}
              onCardClick={(e) => {
                if (hasDraggedRef.current || dragDistanceRef.current > 6) {
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

// ─── Interactive Product Detail Modal ─────────────────────────────────────────
function ProductDetailModal({
  product,
  onClose,
}: {
  product: ProductItem | null;
  onClose: () => void;
}) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (product) {
      window.addEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "hidden";
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "unset";
    };
  }, [product, onClose]);

  if (!product) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200 overscroll-contain"
      onClick={onClose}
    >
      <div
        className="w-full max-w-2xl bg-white rounded-3xl border border-slate-200 shadow-2xl p-6 sm:p-8 space-y-6 text-left max-h-[90vh] overflow-y-auto overscroll-contain"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-slate-50 border border-slate-200 p-2 flex items-center justify-center shrink-0">
              {product.logoUrl ? (
                <img
                  src={product.logoUrl}
                  alt={product.name}
                  className="w-full h-full object-contain"
                />
              ) : (
                <Building2 className="w-8 h-8 text-slate-700" />
              )}
            </div>
            <div>
              <div className="text-xs font-mono uppercase tracking-wider text-slate-500">
                {product.badge || "Ecosystem Solution"}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-950">
                {product.name}
              </h2>
              <p className="text-xs sm:text-sm font-medium text-slate-600">
                {product.tagline}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Overview */}
        <div className="space-y-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            Overview &amp; Architecture
          </h3>
          <p className="text-sm text-slate-700 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Features / Capabilities */}
        {product.features && product.features.length > 0 && (
          <div className="space-y-2.5">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Key Capabilities &amp; Features
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {product.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="flex items-start gap-2 text-xs text-slate-700"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#0090AD] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Solution Focus Tags */}
        {product.tags && product.tags.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Solution Focus Areas
            </h3>
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((t) => (
                <span
                  key={t}
                  className="text-xs font-medium text-slate-700 border border-slate-200 px-2.5 py-1 rounded-md bg-slate-50"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <Link
            href={`/demo?product=${product.id}`}
            onClick={onClose}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#0090AD] hover:bg-[#007b94] text-white text-xs font-bold shadow-md hover:scale-105 transition-all"
          >
            <span>Book 1-on-1 Product Demo</span>
            <ArrowUpRight className="w-4 h-4" />
          </Link>

          {product.url && (
            <a
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-full border border-slate-200 text-slate-700 hover:text-slate-950 hover:bg-slate-50 text-xs font-semibold transition-all"
            >
              <span>Visit Official Website</span>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [selectedProduct, setSelectedProduct] = useState<ProductItem | null>(null);

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
              bulk payment engines, explore the full suite of solutions built by <span className="text-white tracking-tight"><strong className="font-bold">fifth</strong><span className="font-light">lab</span></span> and
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
        <DraggableMarquee items={FIFTHLAB_PRODUCTS} direction="left" speed={1.35} onSelectProduct={setSelectedProduct} />
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
        <DraggableMarquee items={CWG_PRODUCTS} direction="right" speed={1.35} onSelectProduct={setSelectedProduct} />
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

      {/* ── Interactive Product Detail Modal ── */}
      <ProductDetailModal
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
      />

    </div>
  );
}
