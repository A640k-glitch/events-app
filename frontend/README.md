# 🎨 FifthLab Events — Frontend Web Application

> ⚠️ **CRITICAL REMINDER FOR FOLAJIMI:**
> **Always work on the `frontend/core` branch.** Do **NOT** commit or push directly to `main`.
> Verify before coding: `git branch` (should show `* frontend/core`).

**Frontend Lead:** Folajimi Ajayi (`folajimi.ajayi@thefifthlab.com`)  
**Dedicated Branch:** `frontend/core`  
**Stack:** Next.js 16 (App Router), React 19, Tailwind CSS 4, Framer Motion, Lucide React

---

## 📁 Directory Layout

```
frontend/
├── app/
│   ├── layout.tsx             # Root layout with dual theme support & Navbar
│   ├── page.tsx               # Public homepage (Light theme, hero, partner strip, pricing)
│   ├── globals.css            # Tailwind CSS tokens, theme variables, brand palette
│   ├── login/                 # Staff Microsoft SSO login page
│   ├── demo/                  # Public demo booking form
│   └── dashboard/             # Internal admin/staff dashboard (Dark theme)
│       ├── page.tsx           # KPI metrics, live attendance manifest, quick actions
│       ├── events/            # Event management table
│       ├── leads/             # Lead capture records, status tags, CSV export
│       ├── products/          # FifthLab product catalog & demo slots
│       └── settings/          # Corporate settings
├── components/
│   ├── layout/                # Navbar, Footer, Sidebar
│   ├── ui/                    # Apple-compact buttons, badges, modals, cards
│   ├── events/                # EventCard, CategoryPills, AttendanceAvatarStack
│   └── forms/                 # BookingModal, LeadForm
├── context/
│   └── AppContext.tsx         # Global client state management
├── lib/
│   ├── types.ts               # Local types (or imported from ../shared)
│   ├── mock-data.ts           # Demo seed data
│   └── utils.ts               # Styling helpers (clsx, twMerge)
├── public/                    # Assets, logos, SVG icons
├── package.json               # Frontend dependencies & scripts
└── tsconfig.json              # Next.js TypeScript config
```

---

## ⚡ Quick Start for Frontend Team

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Next.js Development Server
```bash
npm run dev
```
Runs on **`http://localhost:3000`**.

---

## 🎯 Brand & UI Rules
- **Public Pages** (`/`, `/demo`, `/login`): **Light Theme** (`#FFFFFF` background, `#0E0E0E` headings, `#00B4D8` teal CTAs).
- **Dashboard** (`/dashboard/*`): **Dark Theme** (`#14171F` background, `#1A1D24` card surface, teal highlights).
- **Apple-Style Compact Design**: Compact padding (`p-4` to `p-6`), 1px crisp borders, responsive from iPhone 5/SE (320px) to Desktop.
