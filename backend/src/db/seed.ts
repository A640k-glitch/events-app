import { PrismaClient, UserRole, EventCategory, EventPriority, AttendanceStatus, LeadStatus } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting Fifth Events database seeding...");

  // Clear existing records
  await prisma.attendanceRecord.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.product.deleteMany();
  await prisma.event.deleteMany();
  await prisma.user.deleteMany();

  console.log("Cleared existing tables.");

  // 1. Seed Users / Product Owners / Staff
  const folajimi = await prisma.user.create({
    data: {
      id: "usr_folajimi",
      name: "Folajimi Ajayi",
      email: "folajimi.ajayi@thefifthlab.com",
      role: UserRole.STAFF,
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      timezone: "WAT",
      workingHours: "9:00 AM - 5:00 PM",
    },
  });

  const abraham = await prisma.user.create({
    data: {
      id: "usr_abraham",
      name: "Abraham Akinwole",
      email: "abraham.akinwole@thefifthlab.com",
      role: UserRole.ADMIN,
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
      timezone: "WAT",
      workingHours: "9:00 AM - 5:00 PM",
    },
  });

  const chioma = await prisma.user.create({
    data: {
      id: "usr_chioma",
      name: "Chioma Okonkwo",
      email: "chioma.okonkwo@thefifthlab.com",
      role: UserRole.PRODUCT_OWNER,
      avatarUrl: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80",
      timezone: "WAT",
      workingHours: "9:00 AM - 5:00 PM",
    },
  });

  const tunde = await prisma.user.create({
    data: {
      id: "usr_tunde",
      name: "Tunde Bakare",
      email: "tunde.bakare@thefifthlab.com",
      role: UserRole.PRODUCT_OWNER,
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
      timezone: "WAT",
      workingHours: "9:00 AM - 5:00 PM",
    },
  });

  console.log("Seeded Users.");

  // 2. Seed Products
  await prisma.product.createMany({
    data: [
      {
        slug: "bulkwave",
        name: "Bulkwave",
        tagline: "Telecom & Messaging Engine",
        description: "Enterprise messaging, SMS aggregator platform, and high-throughput OTP dispatch infrastructure.",
        ownerId: chioma.id,
        iconName: "Radio",
        bgColor: "#F4F4FF",
        activeDemosThisMonth: 14,
      },
      {
        slug: "smerp",
        name: "Smerp",
        tagline: "Enterprise Resource Planning",
        description: "All-in-one ERP powering supply chain, accounting, inventory, and human capital for fast-scaling African businesses.",
        ownerId: tunde.id,
        iconName: "Layers",
        bgColor: "#FCEDFF",
        activeDemosThisMonth: 22,
      },
      {
        slug: "finedge",
        name: "Finedge",
        tagline: "Core Banking & Microfinance Suite",
        description: "Modular digital core banking platform engineered for microfinance banks, commercial lenders, and fintechs.",
        ownerId: chioma.id,
        iconName: "Landmark",
        bgColor: "#E6F8FB",
        activeDemosThisMonth: 9,
      },
      {
        slug: "kuleanpay",
        name: "Kuleanpay",
        tagline: "Unified Multi-Rail Payment Gateway",
        description: "Zero-failure checkout payment orchestrator supporting cards, bank transfers, USSD, and virtual accounts.",
        ownerId: tunde.id,
        iconName: "CreditCard",
        bgColor: "#E6F8FB",
        activeDemosThisMonth: 18,
      },
    ],
  });

  console.log("Seeded Products.");

  // 3. Seed Events
  const event1 = await prisma.event.create({
    data: {
      id: "evt-001",
      title: "West Africa Digital Banking Summit 2026",
      category: EventCategory.SUMMIT,
      priority: EventPriority.HIGH,
      date: new Date("2026-09-15T09:00:00Z"),
      time: "09:00 AM - 05:00 PM WAT",
      location: "Eko Convention Centre, Victoria Island",
      city: "Lagos",
      country: "Nigeria",
      description: "Multi-track fintech keynote indexed with real-time door badge scanning and 1-on-1 executive demo routing across Lagos & Abuja.",
      strategicNotes: "Target Tier-1 and Tier-2 microfinance banks for Finedge core banking and Kuleanpay gateway integrations.",
      boothNumber: "Booth A14 - Main Expo Hall",
      imageUrl: "/images/keynote_lagos.jpg",
      isFeatured: true,
      isPublished: true,
      expectedAttendance: 2500,
      isFifthLabAttending: true,
    },
  });

  const event2 = await prisma.event.create({
    data: {
      id: "evt-002",
      title: "Fintech Core & Enterprise VAS Exposition",
      category: EventCategory.EXPOSITION,
      priority: EventPriority.HIGH,
      date: new Date("2026-09-24T08:30:00Z"),
      time: "08:30 AM - 04:30 PM WAT",
      location: "Landmark Event Centre, Oniru",
      city: "Lagos",
      country: "Nigeria",
      description: "Direct booth visitor lead capture with instant CRM routing to engineering specialists for Bulkwave, Finedge, and SMERP.",
      strategicNotes: "Showcase Bulkwave carrier routing and SMS failover capabilities to fintech aggregators and aggregations partners.",
      boothNumber: "Booth C08 - Telecom Pavilion",
      imageUrl: "/images/exhibition_hall.jpg",
      isFeatured: true,
      isPublished: true,
      expectedAttendance: 1800,
      isFifthLabAttending: true,
    },
  });

  const event3 = await prisma.event.create({
    data: {
      id: "evt-003",
      title: "Founders & Banking Executive Roundtable",
      category: EventCategory.EXECUTIVE_BRIEFING,
      priority: EventPriority.HIGH,
      date: new Date("2026-10-08T10:00:00Z"),
      time: "10:00 AM - 03:00 PM WAT",
      location: "Villa Rosa Kempinski",
      city: "Nairobi",
      country: "Kenya",
      description: "Private executive lounges and strategic briefings with unified attendee credentials and encrypted NDPR compliance.",
      strategicNotes: "VIP discussions on cross-border payments with regional financial regulators.",
      boothNumber: "VIP Boardroom 2",
      imageUrl: "/images/vip_lounge.jpg",
      isFeatured: true,
      isPublished: true,
      expectedAttendance: 350,
      isFifthLabAttending: true,
    },
  });

  const event4 = await prisma.event.create({
    data: {
      id: "evt-004",
      title: "Africa Cloud Architecture & DevOps Conference",
      category: EventCategory.CONFERENCE,
      priority: EventPriority.MEDIUM,
      date: new Date("2026-10-22T09:00:00Z"),
      time: "09:00 AM - 05:00 PM WAT",
      location: "Transcorp Hilton",
      city: "Abuja",
      country: "Nigeria",
      description: "High-throughput cloud architecture, microservices scaling, and cryptographic QR access badge engineering.",
      strategicNotes: "Present FifthLab cloud reliability and payment failover frameworks.",
      boothNumber: "Hall B, Booth 12",
      imageUrl: "/images/qr_registration.jpg",
      isFeatured: true,
      isPublished: true,
      expectedAttendance: 1200,
      isFifthLabAttending: true,
    },
  });

  console.log("Seeded Events.");

  // 4. Seed Attendance Manifest
  await prisma.attendanceRecord.createMany({
    data: [
      { userId: folajimi.id, eventId: event1.id, status: AttendanceStatus.ATTENDING },
      { userId: abraham.id, eventId: event1.id, status: AttendanceStatus.ATTENDING },
      { userId: chioma.id, eventId: event1.id, status: AttendanceStatus.ATTENDING },
      { userId: abraham.id, eventId: event2.id, status: AttendanceStatus.ATTENDING },
      { userId: tunde.id, eventId: event2.id, status: AttendanceStatus.ATTENDING },
    ],
  });

  console.log("Seeded Attendance Records.");

  // 5. Seed Leads
  await prisma.lead.createMany({
    data: [
      {
        visitorName: "Adewale Adeleke",
        company: "Apex Microfinance Bank",
        email: "a.adeleke@apexmfb.ng",
        phone: "+234 803 123 4567",
        productInterested: "Finedge Core Banking",
        assignedProductOwnerId: chioma.id,
        bookingDate: new Date("2026-09-12T14:00:00Z"),
        bookingTime: "02:00 PM WAT",
        status: LeadStatus.QUALIFIED,
        notes: "Interested in cloud-hosted core banking migration for 12 branch locations.",
      },
      {
        visitorName: "Ngozi Eze",
        company: "Trans-Sahara Logistics Ltd",
        email: "ngozi@transsaharalogistics.com",
        phone: "+234 812 987 6543",
        productInterested: "Bulkwave SMS Engine",
        assignedProductOwnerId: tunde.id,
        bookingDate: new Date("2026-09-24T11:00:00Z"),
        bookingTime: "11:00 AM WAT",
        status: LeadStatus.UNREAD,
        notes: "Requires high-volume automated dispatch for cargo tracking notifications.",
      },
    ],
  });

  console.log("Seeded Leads.");
  console.log("✅ Fifth Events database seeding completed successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
