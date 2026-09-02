# Fifth Events — 1-Month Implementation Plan

**Project:** Fifth Events — Enterprise Event & Lead Management Platform
**Brand Reference:** [The FifthLab](https://thefifthlab.com/)
**Existing Frontend:** [fifthlab-events.vercel.app](https://fifthlab-events.vercel.app/)
**Timeline:** August 16, 2026 → September 16, 2026 (4 Weeks)

---

## Team

| Role | Name | Focus Area |
|------|------|------------|
| Backend & Database | **Abraham Akinwole** | API routes, database schema, authentication, server logic, integrations |
| Frontend & Branding | **Folajimi Ajayi** | UI iterations, FifthLab brand alignment, responsive polish, component refinements |

---

## Tech Stack

| Layer | Technology |
|-------|------------|
| Framework | Next.js 16 (App Router) |
| Backend | Next.js API Routes (serverless on Vercel) |
| Database | Neon PostgreSQL (Serverless) |
| ORM | Prisma (type-safe, auto-migrations) |
| Auth | NextAuth.js + Azure AD Provider (restricted to `@thefifthlab.com`) |
| Styling | Tailwind CSS 4 + Framer Motion |
| Email | Nodemailer + Gmail SMTP |
| Icons | Lucide React |
| Deployment | Vercel (frontend + API) · Neon (database) |

---

## FifthLab Brand Guide (Extracted from thefifthlab.com)

> **Theme Strategy — HYBRID**
> - **Public-facing pages** (Homepage, Event Listing, Event Detail, Demo, Login, Pricing): **Light/White theme** matching FifthLab's website
> - **Internal dashboard** (Dashboard, Events Management, Leads, Products, Settings): **Dark theme** (current style, refined with FifthLab accents)

### Color Palette (Exact from Source Code)

| Token | Hex | Usage |
|-------|-----|-------|
| `--brand-primary` | `#00B4D8` | Primary CTA buttons ("See Our Solutions", "Get In Touch →", "View all Insights") |
| `--brand-primary-hover` | `cyan-600` | Primary button hover state |
| `--brand-primary-dark` | `#0090AD` | Dark teal accent (used in "Be more" rounded card section) |
| `--brand-primary-light` | `#E6F8FB` | Light teal card backgrounds |
| `--brand-primary-lighter` | `#E9F5FF` | Product pill badges, very light blue |
| `--brand-dark` | `#000000` (black) | Footer background, "Join Community" section, dashboard bg |
| `--brand-dark-surface` | `#1A1D23` | Dashboard cards, sidebar (events app only) |
| `--brand-white` | `#FFFFFF` | Public page backgrounds |
| `--brand-text-heading` | `#0E0E0E` | All headings on light backgrounds |
| `--brand-text-subtitle` | `#5F5F7A` | Hero subtitle text |
| `--brand-text-body` | `#828282` | Solution descriptions, body copy |
| `--brand-text-nav` | `#7C7C7C` | Navigation links (unhovered) |
| `--brand-text-dark` | `#262626` | Product pill label text |
| `--brand-text-dark-alt` | `#121212` | Dark text on light teal backgrounds |
| `--brand-text-light` | `#F5F5F7` | Text on dark backgrounds |
| `--brand-footer-muted` | `#A19EC2` | Footer links, muted text |
| `--brand-footer-copyright` | `#6F6C90` | Copyright text |
| `--brand-footer-divider` | `#D9DBE9` | Footer horizontal divider |
| `--brand-nav-shadow` | `#D9D9D940` | Navbar drop shadow (25% opacity) |
| `--brand-partner-strip` | `#EDEDEDB2` | Partner logo strip background (70% opacity) |
| `--brand-teal-accent` | `#15949B` | "Do more" accent text |
| `--brand-join-btn` | `#08B6D8` | "Join Now" button text color |
| `--brand-success` | `#22C55E` | Success states, converted leads |
| `--brand-warning` | `#F59E0B` | Warnings, pending states |

### Solution Card Background Colors

| Product | Background | Notes |
|---------|-----------|-------|
| Bulkwave | `#F4F4FF` | Soft purple/lavender |
| Smerp | `#FCEDFF` | Soft pink |
| Kuleanpay | `#E6F8FB80` | 50% opacity light teal |
| Finedge | `#E6F8FB` | Light teal |
| Smerp Go | `#EEEBFF` | Soft purple |
| UCP | `#EDF4FF` | Soft blue |
| beetVAS | `#E7F1FF` | Soft blue |

> For Fifth Events, use these pastel backgrounds for event category cards to mirror FifthLab's product card style.

### Typography (Exact from Source Code)

> ⚠️ **CORRECTION**: FifthLab does **NOT** use serif fonts. All headings are **sans-serif** with `font-medium` (weight 500). The site uses Tailwind's default `font-sans` stack.

| Element | Font | Weight | Size (Desktop) | Tailwind Class |
|---------|------|--------|----------------|----------------|
| Hero H1 | System sans-serif | `font-medium` (500) | `62px` | `text-[62px] font-medium` |
| Section H2 | System sans-serif | `font-medium` (500) | `56px` | `text-[56px] font-medium` |
| Card H3 | System sans-serif | `font-medium` (500) | `36px` | `text-[36px] font-medium` |
| Hero subtitle | System sans-serif | `font-normal` (400) | `23px` | `text-[23px]` |
| Body text | System sans-serif | `font-normal` (400) | `18px` | `text-[18px]` |
| Nav links | System sans-serif | `font-normal` (400) | `16px` | `text-[16px]` |
| CTA buttons | System sans-serif | `font-semibold` (600) | `16–18px` | `text-[18px] font-semibold` |
| Footer headings | System sans-serif | `font-bold` (700) | `20px` | `text-[20px] font-bold` |
| Footer body | System sans-serif | `font-normal` (400) | `18px` | `text-[18px]` |

> **No custom font import needed.** The site relies on the system font stack via Tailwind's `font-sans`. You may optionally use **Inter** for consistency since the existing events app already imports it.

### Button Styles (Exact from Source Code)

| Type | Tailwind Classes | Example |
|------|-----------------|---------|
| **Primary** | `bg-[#00B4D8] text-white font-semibold rounded-full px-8 py-3 text-[18px] hover:bg-cyan-600` | "See Our Solutions", "Get In Touch →", "View all Insights ↗" |
| **Secondary (Dark)** | `bg-[#0E0E0E] text-white font-semibold rounded-[36.65px] px-6 py-3 text-[18px] hover:bg-gray-800` | "Read More ↗" |
| **Ghost** | `text-[#000000] font-bold text-[18px] hover:rounded-full hover:bg-cyan-50` | "Book A Demo →" |
| **Join / Outline** | `bg-white text-[#08B6D8] font-medium rounded-md px-6 py-3` | "Join Now" |
| **Cookie Accept** | `bg-[#00B4D8] text-white font-medium rounded-lg px-4 py-2 text-sm` | "Accept" |
| **Cookie Reject** | `bg-gray-300 text-gray-800 font-medium rounded-lg px-4 py-2 text-sm` | "Reject" |

### Navigation (Exact from Source Code)

```
┌─────────────────────────────────────────────────────────────┐
│  Home  About Us  Solutions▾  Insights    [fifthlab]    [Get In Touch →] │
│  ↑ left-aligned, #7C7C7C              ↑ centered       ↑ right, #00B4D8 │
│  hover:text-black                   absolute center    rounded-full      │
└─────────────────────────────────────────────────────────────┘
  bg-white  shadow-md shadow-[#D9D9D940]  px-10  py-4
```

- **Desktop**: Left nav links + centered logo (absolutely positioned) + right CTA
- **Mobile**: Hamburger → slide-out drawer from left, full-width teal CTA at bottom

### Design Patterns (Exact from Source Code)

| Pattern | Description |
|---------|-------------|
| **Solution cards** | Pastel background per product (see table above), `rounded-3xl` corners, centered icon + name + description + dark "Read More" pill, product mockup image clipped at bottom |
| **Section spacing** | `py-12 sm:py-16` (48–64px) for sections, `px-4 sm:px-6 lg:px-[86px]` |
| **Partner logo strip** | `bg-[#EDEDEDB2]`, auto-scrolling with `animation: scroll 40s linear infinite`, duplicated logos for seamless loop |
| **"Be more" section** | 2-column grid, large `font-medium` text + rounded teal card (`bg-[#0090AD]`, `rounded-[66.42px]`) + light teal card (`bg-[#E6F8FB]`) |
| **Hero section** | Background pattern image with `opacity-3`, floating product cards on arc above, centered heading + subtitle + CTAs below |
| **Insights carousel** | Swiper-based image cards, `rounded-[45px]`, active card `scale-100`, inactive `scale-[0.85] opacity-70 saturate-50`, white gradient fade on edges |
| **Community CTA** | `bg-black text-white`, 60px heading, email input with border-2 white rounded-[10px], "Join Now" button in `bg-white text-[#08B6D8]` |
| **Footer** | `bg-black`, 4-column grid: (1) logo + address + social icons + NDPR badge, (2) Product links, (3) Company links, (4) Contact info with Lucide icons. Divider: `border-[#D9DBE9]`. Links in `#A19EC2`. |

### Tailwind CSS v4 Base Design Tokens (Exact from FifthLab Stylesheet)

```css
@theme {
  --font-sans: ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji";
  --font-mono: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
  
  /* Color Palette (OKLCH) */
  --color-red-50: oklch(97.1% .013 17.38);
  --color-red-400: oklch(70.4% .191 22.216);
  --color-yellow-50: oklch(98.7% .026 102.212);
  --color-yellow-400: oklch(85.2% .199 91.936);
  --color-yellow-500: oklch(79.5% .184 86.047);
  --color-yellow-800: oklch(47.6% .114 61.907);
  --color-cyan-50: oklch(98.4% .019 200.873);
  --color-cyan-200: oklch(91.7% .08 205.041);
  --color-cyan-600: oklch(60.9% .126 221.723);
  --color-blue-50: oklch(97% .014 254.604);
  --color-blue-500: oklch(62.3% .214 259.815);
  --color-blue-600: oklch(54.6% .245 262.881);
  --color-indigo-50: oklch(96.2% .018 272.314);
  --color-indigo-100: oklch(93% .034 272.788);
  --color-indigo-600: oklch(51.1% .262 276.966);
  --color-indigo-800: oklch(39.8% .195 277.366);
  --color-purple-50: oklch(97.7% .014 308.299);
  --color-purple-500: oklch(62.7% .265 303.9);
  --color-pink-50: oklch(97.1% .014 343.198);
  --color-gray-50: oklch(98.5% .002 247.839);
  --color-gray-100: oklch(96.7% .003 264.542);
  --color-gray-200: oklch(92.8% .006 264.531);
  --color-gray-300: oklch(87.2% .01 258.338);
  --color-gray-400: oklch(70.7% .022 261.325);
  --color-gray-500: oklch(55.1% .027 264.364);
  --color-gray-600: oklch(44.6% .03 256.802);
  --color-gray-700: oklch(37.3% .034 259.733);
  --color-gray-800: oklch(27.8% .033 256.848);
  --color-gray-900: oklch(21% .034 264.665);
  --color-black: #000;
  --color-white: #fff;
  
  /* Brand Tokens */
  --color-brand-primary: #00B4D8;
  --color-brand-primary-dark: #0090AD;
  --color-brand-primary-light: #E6F8FB;
  
  /* Spacing & Sizing */
  --spacing: .25rem;
  --radius-md: .375rem;
  --radius-lg: .5rem;
  --radius-xl: .75rem;
  --radius-2xl: 1rem;
  --radius-3xl: 1.5rem;
  --radius-4xl: 2rem;
  
  /* Motion */
  --ease-out: cubic-bezier(0,0,.2,1);
  --ease-in-out: cubic-bezier(.4,0,.2,1);
  --default-transition-duration: .15s;
  --default-transition-timing-function: cubic-bezier(.4,0,.2,1);
}
```

### FifthLab Logo

- **Light bg (header)**: Base64-encoded PNG wordmark (see source), `h-5 object-contain`
- **Dark bg (footer)**: `/assets/darklogo-DcOLRKJ2.png`, `h-8`, white version
- **Favicon**: `/headerlogo.png`
- **Events app**: Use `/plogo.jpg` (already in project root)
- **Social links**: Facebook, X (Twitter), Instagram, LinkedIn — all linking to FifthLab profiles

---

## MVP Feature Scope

| # | Feature | Owner |
|---|---------|-------|
| 1 | Event CRUD (create, read, update, delete) | Abraham |
| 2 | Staff Attendance Manifest (RSVP tracking) | Abraham |
| 3 | Lead Capture Form (public visitor demo bookings) | Abraham + Folajimi |
| 4 | Lead Management Dashboard (status updates, filtering) | Abraham + Folajimi |
| 5 | QR Badge / Ticket Generation | Abraham |
| 6 | CSV Export of Leads | Abraham |
| 7 | Email Notifications (booking confirmations) | Abraham |
| 8 | User Roles (Admin, Staff, Visitor) | Abraham |
| 9 | Products Catalog Management | Abraham + Folajimi |
| 10 | FifthLab Brand Alignment (hybrid light/dark theme) | Folajimi |

> **Note:** Pricing tiers (₦0 / ₦15,000 / ₦50,000) are display-only for this MVP. Payment integration deferred.
> **Note:** Public visitors can browse events and submit lead/demo forms **without** logging in. Only FifthLab staff (`@thefifthlab.com`) require authentication.
> **Note:** Azure AD app registration requires IT request — a dev placeholder/mock auth will be used until credentials are provided.

---

### Apple-Style Compact UI/UX Design System

> **Design Principle**: Compact, clean, and structured Apple-like design language. Crisp 1px borders, uniform spacing, minimal padding bloat, pixel-perfect responsiveness down to 320px (iPhone 5/SE) and 375px (iPhone 6/7/8/SE2).

#### Spacing & Grid System (Compact & Uniform)
- **Base Grid**: 4px / 8px / 12px / 16px / 24px / 32px
- **Card Padding**: Compact `p-4 sm:p-5 md:p-6` (never excessive padding)
- **Section Padding**: `py-8 sm:py-12 md:py-16` (tight, clean vertical rhythm)
- **Container Max-Width**: `max-w-6xl` with `px-4 sm:px-6 lg:px-8` (and `px-3` on 320px screens)
- **Border Treatment**: Crisp `border border-gray-200/80` (light mode) and `border border-white/10` (dark mode)
- **Corner Radii**: `rounded-2xl` for cards, `rounded-full` for action pills, `rounded-lg` for form inputs/badges

---

### Component Deep-Dive Specifications

#### 1. Public Header & Navigation Bar (`Header.tsx`)
- **Visual Style**: Apple-style compact header (`h-14 sm:h-16`), backdrop blur `backdrop-blur-md bg-white/90`, subtle bottom border `border-b border-gray-100/80` with soft drop shadow `shadow-xs`.
- **Layout Distribution**:
  - **Left Section**: Navigation links (`Explore Events`, `Host & Organize`, `Pricing`, `About Us`), font size `text-[14px] sm:text-[15px] font-medium text-[#7C7C7C] hover:text-[#0E0E0E] transition-colors`.
  - **Center**: FifthLab logo (`h-5 sm:h-6 object-contain`), absolutely centered on desktop (`left-1/2 -translate-x-1/2`).
  - **Right Section**: Dual CTA cluster:
    - Text action: `Host Demo` or `Sign In` (staff).
    - Primary action button: `bg-[#00B4D8] hover:bg-cyan-600 text-white text-[14px] font-semibold px-4 sm:px-5 py-2 rounded-full shadow-sm transition-all active:scale-95`.
- **Mobile Navigation (≤ 768px down to 320px)**:
  - Hamburger button with smooth animated Lucide icons (`Menu` / `X`).
  - Left slide-out drawer (`w-[280px] max-w-[85vw] bg-white h-full z-50 p-5 shadow-2xl flex flex-col justify-between`).
  - Compact menu items with subtle hover pills (`px-3 py-2.5 rounded-lg text-gray-800 text-[15px] font-medium`).
  - Bottom sticky CTA: Full-width teal button (`w-full py-2.5 rounded-full bg-[#00B4D8] text-white text-center font-medium`).

#### 2. Event Cards & Category Filters (`EventCard.tsx`, `CategoryPills.tsx`)
- **Category Filter Pills**:
  - Horizontally scrollable container with hidden scrollbar (`flex items-center gap-2 overflow-x-auto py-2 no-scrollbar`).
  - Pills: `px-3.5 py-1.5 rounded-full text-[13px] sm:text-[14px] font-medium transition-all cursor-pointer`.
  - Active state: `bg-[#0E0E0E] text-white shadow-sm`.
  - Inactive state: `bg-gray-100/80 text-gray-600 hover:bg-gray-200/70`.
- **Event Card Structure (Pastel Category Accents)**:
  - Background pastel tokens matched to event type / product lineage:
    - **Fintech / Banking Events**: `bg-[#E6F8FB]` (Finedge teal) with `border-cyan-100`
    - **Enterprise / ERP Events**: `bg-[#FCEDFF]` (Smerp pink) with `border-pink-100`
    - **Telecom / Bulk SMS Events**: `bg-[#F4F4FF]` (Bulkwave lavender) with `border-indigo-100`
    - **General / Public Events**: `bg-[#EDF4FF]` (UCP soft blue) with `border-blue-100`
  - Compact Card Layout:
    - **Header**: Category tag pill (`text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-md bg-white/80 backdrop-blur-xs text-gray-800`) + Event Status / Date badge.
    - **Body**: Title in `text-[17px] sm:text-[19px] font-medium text-[#0E0E0E] leading-snug line-clamp-2 mt-2`, location & time with Lucide icons (`MapPin`, `Clock`) in `text-[13px] text-[#5F5F7A] mt-1.5 flex items-center gap-1.5`.
    - **Footer**: Attendee avatar stack (`-space-x-1.5 flex items-center`) + RSVP Count (`text-[12px] font-medium text-gray-500`) + Compact Action Button (`bg-[#0E0E0E] hover:bg-gray-800 text-white text-[13px] font-medium px-3.5 py-1.5 rounded-full inline-flex items-center gap-1`).

#### 3. Internal Dashboard Layout & Dark Theme (`/dashboard`)
- **Theme Palette**:
  - Background: Pure sleek `#111111` or `#14171F` (deep graphite).
  - Surface/Card Background: `#1A1D24` with ultra-fine `border border-white/10`.
  - Accent Color: `#00B4D8` (Teal KPI badges, active sidebar indicators, primary buttons).
  - Typography: Crisp white `#F5F5F7` for titles, `#A19EC2` for subtitles/table columns, `#6F6C90` for timestamps.
- **Sidebar Navigation**:
  - Compact width (`w-60 lg:w-64`), collapsible on mobile to bottom bar or drawer.
  - Active item: `bg-[#00B4D8]/15 text-[#00B4D8] font-medium rounded-lg px-3 py-2 border-l-2 border-[#00B4D8]`.
  - Inactive item: `text-gray-400 hover:text-white hover:bg-white/5 rounded-lg px-3 py-2 transition-colors`.
- **KPI Metrics Grid**:
  - 4-column compact grid (`grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4`).
  - Cards: `bg-[#1A1D24] p-4 rounded-xl border border-white/10 flex flex-col justify-between`.
  - Value: `text-[24px] sm:text-[28px] font-bold text-white tracking-tight`.
  - Label: `text-[12px] sm:text-[13px] font-medium text-[#A19EC2] uppercase tracking-wider`.
- **Staff Attendance Manifest Table**:
  - Compact table rows with `py-2.5 px-3 border-b border-white/5 text-[13px] sm:text-[14px]`.
  - Live RSVP status chips:
    - Confirmed: `bg-emerald-500/15 text-emerald-400 border border-emerald-500/20 px-2 py-0.5 rounded-md text-[11px] font-medium`.
    - Pending: `bg-amber-500/15 text-amber-400 border border-amber-500/20 px-2 py-0.5 rounded-md text-[11px] font-medium`.
    - Declined: `bg-rose-500/15 text-rose-400 border border-rose-500/20 px-2 py-0.5 rounded-md text-[11px] font-medium`.

#### 4. Authentication & Role Permissions Flow (`auth.ts`, `middleware.ts`)
- **NextAuth Azure AD Configuration**:
  - Provider: `AzureADProvider` configured with `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`.
  - Restrict sign-in domain: Validate `profile.email.endsWith('@thefifthlab.com')` in the `signIn` callback.
- **Development Mock / Bypass Mode**:
  - Environment Flag: `ENABLE_DEV_AUTH_BYPASS=true` in `.env.local`.
  - When enabled, allows instant 1-click dev login as:
    1. **Admin**: `admin@thefifthlab.com` (Full CRUD, User Roles, Lead Export, Settings)
    2. **Staff**: `staff@thefifthlab.com` (View Events, Staff RSVP, View Leads)
    3. **Visitor**: Unauthenticated / Public Mode (Browse public events, Submit demo forms)
- **Route Guard Matrix**:
  - `/` (Public Homepage) -> Open to all
  - `/events` & `/events/[id]` (Event Details) -> Public browse + Public demo booking
  - `/events/[id]/rsvp` (Staff RSVP) -> Requires `@thefifthlab.com` login
  - `/dashboard/*` (Internal Management) -> Requires `@thefifthlab.com` login + Role verification
  - `/dashboard/settings` & `/dashboard/products` -> Admin role only

---

### Mobile Responsiveness Matrix (iPhone 5/SE to Desktop)

| Device Breakpoint | Screen Width | Key Layout Adaptations |
|-------------------|--------------|------------------------|
| **iPhone 5 / 5S / SE 1st Gen** | `320px` | Single-column cards, `px-3` root padding, `text-[24px]` H1 heading, compact `text-[13px]` buttons, 2-column KPI grid with `gap-2` |
| **iPhone 6 / 7 / 8 / SE 2nd & 3rd Gen** | `375px` | Standard compact mobile layout, `px-4` padding, full-width swipeable category pills |
| **Modern Phones (iPhone 12/14/15, Galaxy)** | `390px – 430px` | Optimal mobile view, stacked hero CTAs with full touch targets (`min-h-[44px]`) |
| **Tablets & Foldables (iPad Mini / Fold)** | `768px – 834px` | 2-column event grid, visible desktop navigation links, dual-action hero buttons side-by-side |
| **Desktop / Laptop** | `1024px – 1440px+` | Full 3-column event grid, fixed 60px sidebar for dashboard, centered logo with split nav |

---

## Page Theme Mapping

| Page | Theme | Notes |
|------|-------|-------|
| Homepage (`/`) | ☀️ Light | White bg, teal CTAs, sans-serif font-medium headings, partner logo strip |
| Event Listing (`/events`) | ☀️ Light | White cards with pastel product tints, clean filters, teal accents |
| Event Detail (`/events/[id]`) | ☀️ Light | White layout, teal RSVP buttons, compact avatar stack |
| Demo / Booking (`/demo`) | ☀️ Light | Compact white form card, teal submit button, clear error states |
| Login (`/login`) | ☀️ Light | Centered white card, "Sign in with Microsoft" teal pill button |
| Pricing (`/#pricing`) | ☀️ Light | Compact white cards with subtle borders, teal "Most Popular" badge |
| Dashboard (`/dashboard`) | 🌙 Dark | Graphite bg (`#14171F`), `#1A1D24` cards, teal accent highlights |
| Events Management (`/dashboard/events`) | 🌙 Dark | Dark data table, compact action buttons, QR modal |
| Leads (`/dashboard/leads`) | 🌙 Dark | Dark data table, colored status chips, CSV export |
| Products (`/dashboard/products`) | 🌙 Dark | Dark product cards, book demo triggers |
| Settings (`/dashboard/settings`) | 🌙 Dark | Dark compact forms, subtle borders, toggle switches |

---

## Implementation Phases

### Phase 1 — Foundation & Setup (Week 1: Aug 16 – Aug 22)

| | Abraham Akinwole (Backend & Database) | Folajimi Ajayi (Frontend & Branding) |
|---|---|---|
| **Day 1–2** | Set up Neon PostgreSQL instance and connect to project. Install Prisma, configure `schema.prisma` with all data models: `User`, `Event`, `AttendanceRecord`, `Lead`, `Product`, `ProductOwner`, `BookingSubmission`. Run initial migration. | Study the FifthLab Brand Guide above. Set up the **dual-theme system** in `globals.css` and Tailwind config: define light theme tokens for public pages and dark theme tokens for dashboard. Configure all brand color variables (see Brand Guide above — `#00B4D8` primary, `#0E0E0E` headings, `#828282` body, etc.). Typography uses system sans-serif with `font-medium` for headings — no custom font import needed. |
| **Day 3–4** | Install and configure NextAuth.js with Azure AD provider. Implement domain restriction (`@thefifthlab.com` only). Create a dev/mock auth bypass for local testing until IT provides Azure AD app credentials. Set up middleware to protect `/dashboard/*` routes. | Redesign the **Navbar/Header** to match FifthLab: minimal left-aligned nav links (Explore Events, Host & Organize, Pricing), centered FifthLab logo, right-aligned teal pill-shaped "Get In Touch →" CTA button. White/transparent header for light pages, dark/glass header for dashboard. Build matching **Footer** — dark `#111111` bg, multi-column layout (Products, Company, Contact Us), FifthLab logo + social icons, geometric wireframe art. |
| **Day 5** | Create seed script to migrate existing mock data (`lib/mock-data.ts`) into Neon database via Prisma. Set up `.env` files and environment variable structure. Verify database connectivity end-to-end. | Build reusable brand components: `BrandButton` (primary/secondary/outline/ghost variants per brand guide), `SectionHeading` (serif H2 with subtitle), `BrandCard` (white card with subtle border for light pages, dark card for dashboard). Ensure mobile hamburger menu matches brand. |
| **Deliverables** | ✅ Neon DB live with schema · ✅ Prisma configured · ✅ NextAuth with dev bypass · ✅ Seed data loaded | ✅ Dual-theme system configured · ✅ Brand fonts imported · ✅ Navbar + Footer redesigned · ✅ Reusable brand components built |

---

### Phase 2 — Core API & UI Alignment (Week 2: Aug 23 – Aug 29)

| | Abraham Akinwole (Backend & Database) | Folajimi Ajayi (Frontend & Branding) |
|---|---|---|
| **Day 1–2** | Build Event API routes: `GET /api/events` (list + filters), `GET /api/events/[id]` (detail), `POST /api/events` (create), `PUT /api/events/[id]` (update), `DELETE /api/events/[id]` (delete). Add input validation and error handling. | Redesign the **Homepage** (☀️ light theme): white background, large `text-[62px] font-medium` sans-serif hero heading, `text-[23px] text-[#5F5F7A]` subtitle, teal `bg-[#00B4D8] rounded-full` CTA + ghost "Book A Demo →" link. Add **partner logo strip** below hero (grayscale logos of CWG PLC, Texcellence, etc.). Redesign pricing section with clean white cards and teal "Most Popular" badge. |
| **Day 2–3** | Build Attendance Manifest API: `POST /api/events/[id]/rsvp` (staff RSVP), `GET /api/events/[id]/manifest` (get attendance list), `PATCH /api/events/[id]/rsvp/[userId]` (update RSVP status). | Redesign **Dashboard overview** (🌙 dark theme): dark bg `#1A1D23`, update KPI cards with subtle dark borders (`rgba(255,255,255,0.1)`), teal accent numbers, Inter font. Ensure responsive behavior across all screen sizes including iPhone 5/SE and iPhone 6. |
| **Day 3–4** | Build Lead Capture API: `POST /api/leads` (public — no auth required, creates lead from visitor form), `GET /api/leads` (protected — list with filters/search), `PATCH /api/leads/[id]` (update status). | Redesign **Event listing** page (☀️ light) — white event cards with subtle borders, teal "View Details" buttons, `text-[56px] font-medium` section heading. Redesign **Event detail** page (☀️ light) — clean white layout, teal RSVP action buttons, attendance manifest with avatar stack. |
| **Day 5** | Build Products API: `GET /api/products` (list), `GET /api/products/[id]` (detail), `POST /api/products` (create — admin only), `PUT /api/products/[id]` (update). Connect all API routes to Prisma/Neon. | Redesign the **Login page** (☀️ light): centered white card on off-white (`#F7F7F8`) background, FifthLab logo at top, teal "Sign in with Microsoft" pill button, "For @thefifthlab.com accounts only" helper text in muted gray. |
| **Deliverables** | ✅ All CRUD APIs live · ✅ RSVP/manifest endpoints · ✅ Lead capture (public) · ✅ Products API | ✅ Homepage redesigned (light) · ✅ Dashboard styled (dark) · ✅ Events pages branded · ✅ Login page updated |

---

### Phase 3 — Advanced Features & Integrations (Week 3: Aug 30 – Sep 5)

| | Abraham Akinwole (Backend & Database) | Folajimi Ajayi (Frontend & Branding) |
|---|---|---|
| **Day 1–2** | Build QR Badge generation: Create `GET /api/events/[id]/badge/[userId]` endpoint that generates a QR code (using `qrcode` npm package) containing attendee info + event ID. Return as downloadable PNG/SVG. | Redesign the **Lead Management** page (🌙 dark): dark data table with clean column headers, colored status badges (Unread=blue, Followed Up=amber, Qualified=teal, Converted=green, Closed=gray), teal filter/search UI, Inter typography throughout. |
| **Day 2–3** | Build CSV Export: Create `GET /api/leads/export` endpoint that queries leads with filters and returns a CSV file download. Include all lead fields (name, company, email, phone, product, status, date). | Redesign the **Products Catalog** page (🌙 dark): dark product cards matching FifthLab's product showcase style (centered icon, product name in Inter semi-bold, tagline in muted text, teal "Book Demo" button). Style the demo booking modal with dark glass bg, teal submit button. |
| **Day 3–4** | Set up Nodemailer with Gmail SMTP. Build email notification system: send confirmation email when a visitor submits a lead/demo booking form. Create HTML email template using FifthLab brand colors (teal header, white body, dark footer). | Redesign the **Settings** page (🌙 dark): clean dark forms with subtle borders, teal toggle/switch accents, properly spaced form groups, Inter labels. Build the **Demo/Booking** page (☀️ light): clean white form card, teal submit button, `font-medium` sans-serif heading. |
| **Day 5** | Implement role-based access control middleware. Define permissions: **Admin** (full CRUD, user management), **Staff** (view events, RSVP, view leads), **Visitor** (browse events, submit lead forms). Apply to all protected routes. | Cross-device responsive testing. Test every page on iPhone 5/SE, iPhone 6/7/8, iPhone X/12/14, iPad, and desktop breakpoints. Test both light and dark themed pages. Fix any layout breaks, overflow issues, or spacing inconsistencies. |
| **Deliverables** | ✅ QR badge generation · ✅ CSV export · ✅ Email notifications · ✅ RBAC middleware | ✅ Lead page styled (dark) · ✅ Products page styled (dark) · ✅ Settings page styled · ✅ Booking page (light) · ✅ Responsive audit complete |

---

### Phase 4 — Integration, Testing & Deployment (Week 4: Sep 6 – Sep 16)

| | Abraham Akinwole (Backend & Database) | Folajimi Ajayi (Frontend & Branding) |
|---|---|---|
| **Day 1–2** | Replace all mock data imports across the frontend with real API calls. Update `AppContext.tsx` to fetch from `/api/*` endpoints instead of `lib/mock-data.ts`. Add loading states and error handling for all data fetching. | Wire up frontend forms to real APIs: Lead capture form → `POST /api/leads`, Event creation → `POST /api/events`, RSVP buttons → `POST /api/events/[id]/rsvp`, Booking form → `POST /api/leads`. Add form validation and success/error feedback UI with teal toast notifications. |
| **Day 3–4** | Write integration tests for critical API flows: event CRUD, lead submission, auth flow, RSVP, CSV export. Test edge cases (invalid inputs, unauthorized access, duplicate submissions). Fix any bugs. | Add micro-animations and polish: page transitions (Framer Motion), hover effects matching FifthLab's subtle style, loading skeletons (light shimmer for public pages, dark shimmer for dashboard), teal progress indicators. |
| **Day 5–6** | Set up production Neon database. Configure Vercel environment variables (DATABASE_URL, NEXTAUTH_SECRET, AZURE_AD credentials, SMTP credentials). Deploy to production. Run smoke tests on live deployment. | Final brand audit: compare every public page side-by-side with thefifthlab.com screenshots. Verify serif headings, teal buttons, white backgrounds, and footer match the brand. Compare dashboard dark theme for consistency. Fix remaining issues. |
| **Day 7–8** | Security audit: validate all protected routes require auth, ensure domain restriction works, verify CORS settings, sanitize all user inputs, add rate limiting to public endpoints (lead capture). | Final cross-browser testing (Chrome, Safari, Firefox, Edge). Prepare demo walkthrough — screenshots of both light (public) and dark (dashboard) views. Brief video of the complete user flow for stakeholder presentation. |
| **Day 9–11** | Joint bug-fix sprint. Address all issues found during testing. Performance optimization: add database indexes, implement API response caching where appropriate. Finalize documentation (API reference, setup guide). | Joint bug-fix sprint. Fix any remaining UI issues. Clean up unused components and CSS. Ensure all pages pass accessibility checks (proper alt tags, keyboard navigation, contrast ratios). Verify smooth light↔dark theme transition when navigating between public and dashboard pages. |
| **Deliverables** | ✅ All mock data replaced · ✅ Tests passing · ✅ Production deployed · ✅ Security audit complete · ✅ Documentation | ✅ All forms wired to APIs · ✅ Animations added · ✅ Brand audit passed · ✅ Cross-browser tested · ✅ Demo ready |

---

## Database Schema (Neon PostgreSQL via Prisma)

```prisma
model User {
  id            String   @id @default(cuid())
  name          String
  email         String   @unique
  role          UserRole @default(STAFF)
  avatarUrl     String?
  timezone      String   @default("WAT")
  workingHours  String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt

  rsvps         AttendanceRecord[]
  assignedLeads Lead[]
  ownedProducts Product[]
}

enum UserRole {
  ADMIN
  STAFF
  VISITOR
}

model Event {
  id                  String   @id @default(cuid())
  title               String
  category            String
  priority            String
  date                DateTime
  time                String
  location            String
  city                String
  country             String   @default("Nigeria")
  description         String
  strategicNotes      String?
  boothNumber         String?
  expectedAttendance  Int      @default(0)
  isFifthLabAttending Boolean  @default(false)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  attendanceManifest  AttendanceRecord[]
}

model AttendanceRecord {
  id          String   @id @default(cuid())
  userId      String
  eventId     String
  status      String   @default("Maybe")
  confirmedAt DateTime @default(now())

  user  User  @relation(fields: [userId], references: [id])
  event Event @relation(fields: [eventId], references: [id])

  @@unique([userId, eventId])
}

model Lead {
  id                   String   @id @default(cuid())
  visitorName          String
  company              String
  email                String
  phone                String
  productInterested    String
  assignedProductOwner String?
  bookingDate          String?
  bookingTime          String?
  status               String   @default("Unread")
  notes                String?
  createdAt            DateTime @default(now())
  updatedAt            DateTime @updatedAt

  assignedUser User? @relation(fields: [assignedProductOwner], references: [id])
}

model Product {
  id                  String   @id @default(cuid())
  name                String
  tagline             String
  description         String
  ownerId             String
  iconName            String
  activeDemosThisMonth Int     @default(0)
  availableSlots      String[]
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  owner User @relation(fields: [ownerId], references: [id])
}
```

---

## Authentication Flow

```
┌─────────────────────────────────────────────────┐
│           Login Page (☀️ Light Theme)             │
│                                                   │
│         ┌────────────────────────┐                │
│         │    fifthlab logo       │                │
│         └────────────────────────┘                │
│                                                   │
│   ┌─────────────────────────────────────────┐     │
│   │  [ Sign in with Microsoft ]  (teal btn) │     │
│   └──────────────────┬──────────────────────┘     │
│                      │                             │
│    "For @thefifthlab.com accounts only"            │
│                      │                             │
│                      ▼                             │
│           Azure AD OAuth Flow                      │
│    (restricted to @thefifthlab.com tenant)         │
│                      │                             │
│                      ▼                             │
│         NextAuth.js Session Created                │
│    (role assigned: Admin or Staff)                 │
│                      │                             │
│                      ▼                             │
│        Redirect to /dashboard (🌙 Dark)           │
└─────────────────────────────────────────────────┘

DEV MODE: Mock auth bypass enabled until
Azure AD app registration is completed by IT.
```

---

## API Endpoints Summary

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET` | `/api/events` | Public | List all events (with filters) |
| `GET` | `/api/events/[id]` | Public | Get event detail |
| `POST` | `/api/events` | Admin | Create new event |
| `PUT` | `/api/events/[id]` | Admin | Update event |
| `DELETE` | `/api/events/[id]` | Admin | Delete event |
| `GET` | `/api/events/[id]/manifest` | Staff+ | Get attendance manifest |
| `POST` | `/api/events/[id]/rsvp` | Staff+ | Submit/update RSVP |
| `GET` | `/api/events/[id]/badge/[userId]` | Staff+ | Generate QR badge |
| `GET` | `/api/leads` | Staff+ | List leads (filters, search) |
| `POST` | `/api/leads` | **Public** | Submit lead/demo form |
| `PATCH` | `/api/leads/[id]` | Staff+ | Update lead status |
| `GET` | `/api/leads/export` | Admin | Export leads as CSV |
| `GET` | `/api/products` | Public | List products |
| `POST` | `/api/products` | Admin | Create product |
| `PUT` | `/api/products/[id]` | Admin | Update product |
| `GET` | `/api/auth/[...nextauth]` | — | NextAuth.js handler |

---

## Key Dependencies to Install

```bash
# Backend & Database
npm install prisma @prisma/client
npm install next-auth @auth/prisma-adapter
npm install nodemailer
npm install qrcode
npm install csv-stringify

# Dev dependencies
npm install -D @types/nodemailer @types/qrcode
```

---

## Environment Variables

```env
# Database (Neon)
DATABASE_URL="postgresql://user:pass@ep-xxx.neon.tech/fifthevents?sslmode=require"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="generate-a-random-secret-here"

# Azure AD (placeholder until IT provides)
AZURE_AD_CLIENT_ID="placeholder-client-id"
AZURE_AD_CLIENT_SECRET="placeholder-client-secret"
AZURE_AD_TENANT_ID="placeholder-tenant-id"

# Email (Gmail SMTP)
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_USER="fifthevents@gmail.com"
SMTP_PASS="app-specific-password"

# Dev Mode
DEV_AUTH_BYPASS="true"
```

---

## Milestones & Checkpoints

| Date | Milestone | Status |
|------|-----------|--------|
| Aug 22 | **Week 1 Checkpoint** — DB schema live, auth scaffold, dual-theme system configured, brand components built | ⬜ |
| Aug 29 | **Week 2 Checkpoint** — All core APIs built, homepage (light) + dashboard (dark) redesigned | ⬜ |
| Sep 5 | **Week 3 Checkpoint** — QR badges, CSV, emails working; all pages branded (light/dark) | ⬜ |
| Sep 12 | **Week 4 Checkpoint** — Mock data replaced, integration tests passing | ⬜ |
| Sep 16 | **🚀 Launch** — Production deployment, stakeholder demo | ⬜ |

---

## Communication & Workflow

- **Daily Standups**: Brief async check-in (Slack/Teams) — what you did, what's next, any blockers.
- **Git Workflow**: Feature branches → Pull Requests → Code review → Merge to `main`.
- **Branch Naming**: `feat/event-api`, `feat/brand-navbar`, `fix/mobile-overflow`, etc.
- **Deployment**: Push to `main` auto-deploys to Vercel.

---

*Document prepared: August 16, 2026*
*Project: Fifth Events — The FifthLab Nigeria*
