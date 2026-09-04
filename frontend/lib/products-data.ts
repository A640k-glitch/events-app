import { FifthLabProduct } from "./types";

export const PRODUCT_LOGO_MAP: Record<string, string> = {
  bulkwave: "/brand/bulkwave-icon.png",
  finedge: "/brand/finedge-logo.png",
  smerp: "/brand/smerp-icon.png",
  smerpgo: "/brand/smerp-icon.png",
  ucp: "/brand/ucp-emblem.png",
  kuleanpay: "/brand/kuleanpay-icon.png",
  beetvas: "/brand/beetvaslogo.png",
  "cwg-cloud": "/brand/cwg/cloud.svg",
  "cwg-atm": "/brand/cwg/atm.svg",
  "cwg-managed": "/brand/cwg/managed.svg",
  "cwg-managed-services": "/brand/cwg/managed.svg",
  "cwg-payments": "/brand/cwg/payments.svg",
  "cwg-infra": "/brand/cwg/infrastructure.svg",
  "cwg-infrastructure": "/brand/cwg/infrastructure.svg",
  "cwg-software": "/brand/cwg/software.svg",
  "cwg-training": "/brand/cwg/training.svg",
  texcellence: "/brand/texcellence-logo.png",
};

export function resolveProductLogo(identifier?: string, currentLogoUrl?: string): string {
  if (currentLogoUrl && currentLogoUrl !== "/favicon.ico" && !currentLogoUrl.includes("favicon")) {
    return currentLogoUrl;
  }

  if (!identifier) return "/brand/bulkwave-icon.png";
  const cleanKey = identifier.toLowerCase().replace(/[^a-z0-9-]/g, "");

  for (const [key, logo] of Object.entries(PRODUCT_LOGO_MAP)) {
    if (cleanKey.includes(key) || key.includes(cleanKey)) {
      return logo;
    }
  }

  // Name keyword heuristics
  if (cleanKey.includes("bulk") || cleanKey.includes("wave")) return "/brand/bulkwave-icon.png";
  if (cleanKey.includes("fin") || cleanKey.includes("edge")) return "/brand/finedge-logo.png";
  if (cleanKey.includes("smerp")) return "/brand/smerp-icon.png";
  if (cleanKey.includes("coop") || cleanKey.includes("ucp")) return "/brand/ucp-emblem.png";
  if (cleanKey.includes("pay") || cleanKey.includes("kulean")) return "/brand/kuleanpay-icon.png";
  if (cleanKey.includes("vas") || cleanKey.includes("beet")) return "/brand/beetvaslogo.png";
  if (cleanKey.includes("cloud")) return "/brand/cwg/cloud.svg";
  if (cleanKey.includes("atm")) return "/brand/cwg/atm.svg";
  if (cleanKey.includes("managed")) return "/brand/cwg/managed.svg";
  if (cleanKey.includes("terminal") || cleanKey.includes("payment")) return "/brand/cwg/payments.svg";
  if (cleanKey.includes("infra")) return "/brand/cwg/infrastructure.svg";
  if (cleanKey.includes("soft")) return "/brand/cwg/software.svg";
  if (cleanKey.includes("train") || cleanKey.includes("academy")) return "/brand/cwg/training.svg";

  return "/brand/bulkwave-icon.png";
}

export const CANONICAL_FALLBACK_PRODUCTS: FifthLabProduct[] = [
  {
    id: "prod-bulkwave",
    slug: "bulkwave",
    name: "Bulkwave",
    tagline: "Bulk Rewards & Communication Engine",
    description: "High-volume airtime, data, and SMS distribution platform enabling businesses to reward customers and distribute value at scale across Nigeria's telecom networks in real time.",
    ownerName: "Tunde Bakare",
    iconName: "Radio",
    bgColor: "#F4F4FF",
    logoUrl: "/brand/bulkwave-icon.png",
    tags: ["Airtime Distribution", "Bulk SMS", "Data Vending", "High Concurrency API"],
    activeDemosThisMonth: 34,
    availableSlots: ["09:00 AM", "11:00 AM", "02:00 PM", "04:00 PM"],
    leadsCount: 18,
    conversionRate: 72,
  },
  {
    id: "prod-finedge",
    slug: "finedge",
    name: "FinEdge",
    tagline: "Core Banking for Microfinance",
    description: "Modern cloud-native core banking solution designed for MFBs and financial institutions to streamline loan management, member savings, compliance reporting, and digital branch operations.",
    ownerName: "Chioma Okonjo",
    iconName: "Landmark",
    bgColor: "#EAF7F7",
    logoUrl: "/brand/finedge-logo.png",
    tags: ["MFB Core", "Loan Management", "CBN Compliance", "Branchless Banking"],
    activeDemosThisMonth: 28,
    availableSlots: ["10:00 AM", "01:00 PM", "03:00 PM"],
    leadsCount: 24,
    conversionRate: 68,
  },
  {
    id: "prod-smerp",
    slug: "smerp",
    name: "Smerp / SmerpGo",
    tagline: "SME & Field-Team ERP Platform",
    description: "Comprehensive enterprise resource planning built for SMEs and distributed field teams, covering inventory management, accounting, order tracking, and real-time operations dashboards.",
    ownerName: "Olumide Adeleke",
    iconName: "Layers",
    bgColor: "#FCEDFF",
    logoUrl: "/brand/smerp-icon.png",
    tags: ["Inventory Sync", "Real-Time Accounting", "Field Workforce", "Operations"],
    activeDemosThisMonth: 42,
    availableSlots: ["09:30 AM", "11:30 AM", "02:30 PM", "04:30 PM"],
    leadsCount: 31,
    conversionRate: 65,
  },
  {
    id: "prod-ucp",
    slug: "ucp",
    name: "Unified Cooperative Platform",
    tagline: "Digital Platform for Cooperative Societies",
    description: "End-to-end management platform for cooperative societies, credit unions, and thrift organizations with automated ledgering, dividend calculations, and member self-service.",
    ownerName: "Amina Yusuf",
    iconName: "Users",
    bgColor: "#F0FDF4",
    logoUrl: "/brand/ucp-emblem.png",
    tags: ["Cooperatives", "Automated Ledgers", "Thrift Schemes", "Member Portals"],
    activeDemosThisMonth: 19,
    availableSlots: ["10:00 AM", "12:00 PM", "03:00 PM"],
    leadsCount: 14,
    conversionRate: 60,
  },
  {
    id: "prod-kuleanpay",
    slug: "kuleanpay",
    name: "KuleanPay",
    tagline: "Multi-Rail Payment Orchestration",
    description: "Unified payment gateway and settlement engine allowing businesses to accept payments seamlessly across cards, virtual accounts, bank transfers, and USSD with zero downtime.",
    ownerName: "Babatunde Ojo",
    iconName: "CreditCard",
    bgColor: "#F0F9FF",
    logoUrl: "/brand/kuleanpay-icon.png",
    tags: ["Payment Gateway", "Multi-Rail", "Instant Settlement", "Virtual Accounts"],
    activeDemosThisMonth: 39,
    availableSlots: ["09:00 AM", "11:00 AM", "01:00 PM", "04:00 PM"],
    leadsCount: 29,
    conversionRate: 75,
  },
  {
    id: "prod-beetvas",
    slug: "beetvas",
    name: "BeetVAS",
    tagline: "Value Added Services Aggregator",
    description: "Enterprise VAS aggregation engine delivering utility bill payments, digital content distribution, airtime APIs, and lifestyle services for fintechs and telecoms.",
    ownerName: "Tunde Bakare",
    iconName: "Sparkles",
    bgColor: "#FFFBEB",
    logoUrl: "/brand/beetvaslogo.png",
    tags: ["VAS Aggregator", "Utility Payments", "Cable TV", "Lifestyle APIs"],
    activeDemosThisMonth: 23,
    availableSlots: ["10:30 AM", "01:30 PM", "03:30 PM"],
    leadsCount: 17,
    conversionRate: 64,
  },
  {
    id: "prod-cwg-cloud",
    slug: "cwg-cloud",
    name: "CWG Enterprise Cloud & Datacenter",
    tagline: "Tier III Sovereign Cloud Infrastructure",
    description: "Tier-III datacenter hosting, disaster recovery, hybrid cloud architecture, and high-availability enterprise compute designed for financial institutions and telecom carriers.",
    ownerName: "CWG Infrastructure Lead",
    iconName: "Cloud",
    bgColor: "#F8FAFC",
    logoUrl: "/brand/cwg/cloud.svg",
    tags: ["Datacenter Hosting", "Tier III", "Disaster Recovery", "Sovereign Cloud"],
    activeDemosThisMonth: 16,
    availableSlots: ["11:00 AM", "02:00 PM", "04:00 PM"],
    leadsCount: 12,
    conversionRate: 70,
  },
  {
    id: "prod-cwg-atm",
    slug: "cwg-atm",
    name: "CWG Self-Service & ATM Solutions",
    tagline: "Banking Hardware & Fleet Management",
    description: "Mission-critical automated teller machine infrastructure, recycling ATMs, biometric cash terminals, and 24/7 uptime engineering across West Africa.",
    ownerName: "CWG Hardware Specialist",
    iconName: "Cpu",
    bgColor: "#F8FAFC",
    logoUrl: "/brand/cwg/atm.svg",
    tags: ["ATM Fleets", "Uptime Engineering", "Banking Hardware", "Maintenance"],
    activeDemosThisMonth: 12,
    availableSlots: ["10:00 AM", "01:00 PM", "03:00 PM"],
    leadsCount: 10,
    conversionRate: 62,
  },
  {
    id: "prod-cwg-managed",
    slug: "cwg-managed",
    name: "CWG IT Managed Services",
    tagline: "Enterprise Infrastructure & NOC Operations",
    description: "End-to-end outsourced IT management covering network infrastructure, data center operations, security management, LAN/WAN, and application support.",
    ownerName: "CWG Operations Lead",
    iconName: "Server",
    bgColor: "#F8FAFC",
    logoUrl: "/brand/cwg/managed.svg",
    tags: ["NOC Operations", "LAN/WAN", "Security Management", "Outsourced IT"],
    activeDemosThisMonth: 15,
    availableSlots: ["09:00 AM", "12:00 PM", "02:30 PM"],
    leadsCount: 13,
    conversionRate: 67,
  },
  {
    id: "prod-cwg-payments",
    slug: "cwg-payments",
    name: "Payment Terminal Solutions",
    tagline: "Point-of-Sale Hardware & Merchant Terminals",
    description: "Reliable and secure payment terminal systems and merchant acquiring infrastructure tailored for financial service institutions and retail enterprises.",
    ownerName: "CWG Fintech Systems",
    iconName: "CreditCard",
    bgColor: "#F0F9FF",
    logoUrl: "/brand/cwg/payments.svg",
    tags: ["POS Terminals", "Merchant Acquiring", "Card Processing", "Fintech"],
    activeDemosThisMonth: 18,
    availableSlots: ["10:00 AM", "01:30 PM", "03:30 PM"],
    leadsCount: 16,
    conversionRate: 69,
  },
  {
    id: "prod-cwg-infra",
    slug: "cwg-infra",
    name: "IT Infrastructure Services",
    tagline: "Data Center, Hardware & Architecture",
    description: "High-availability enterprise computing hardware, enterprise storage networks, power backup systems, and comprehensive data center integration.",
    ownerName: "CWG Systems Architect",
    iconName: "Cpu",
    bgColor: "#F0FDFA",
    logoUrl: "/brand/cwg/infrastructure.svg",
    tags: ["Data Center", "Hardware Architecture", "Networking", "Storage"],
    activeDemosThisMonth: 14,
    availableSlots: ["09:30 AM", "12:00 PM", "03:00 PM"],
    leadsCount: 11,
    conversionRate: 63,
  },
  {
    id: "prod-cwg-software",
    slug: "cwg-software",
    name: "Enterprise Software Services",
    tagline: "Custom Development, Integration & QA",
    description: "Bespoke software architecture, core integration, and quality assurance services powering Tier-1 banks, telcos, and government agencies.",
    ownerName: "CWG Software Engineering",
    iconName: "Code",
    bgColor: "#FAF5FF",
    logoUrl: "/brand/cwg/software.svg",
    tags: ["Custom Dev", "Core Integration", "Quality Assurance", "APIs"],
    activeDemosThisMonth: 21,
    availableSlots: ["11:00 AM", "02:00 PM", "04:30 PM"],
    leadsCount: 19,
    conversionRate: 71,
  },
  {
    id: "prod-cwg-training",
    slug: "cwg-training",
    name: "CWG Training Academy",
    tagline: "IT Professional Certification & Development",
    description: "Professional IT training and certification programs for enterprise technologists, covering cloud, cybersecurity, networking, and the CWG Tech Community.",
    ownerName: "CWG Academy Director",
    iconName: "GraduationCap",
    bgColor: "#FFFBEB",
    logoUrl: "/brand/cwg/training.svg",
    tags: ["Academy", "Certifications", "Cybersecurity", "Tech Community"],
    activeDemosThisMonth: 25,
    availableSlots: ["10:00 AM", "01:00 PM", "03:00 PM"],
    leadsCount: 22,
    conversionRate: 66,
  },
];
