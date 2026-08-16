# 🏢 Fifth Events — Enterprise Event & Lead Management Platform

Welcome to **Fifth Events**, the enterprise event management, lead conversion, and attendance manifest platform designed for [The FifthLab](https://thefifthlab.com/).

---

## 👥 Team & Ownership

| Role | Team Member | Primary Directory | Focus Area |
|---|---|---|---|
| **Backend & Database** | **Abraham Akinwole** | [`backend/`](./backend/) | API routes, Prisma schemas, Neon DB, Auth, Email & QR services |
| **Frontend & UI/UX** | **Folajimi Ajayi** | [`frontend/`](./frontend/) | Next.js App Router, Tailwind 4, Framer Motion, Dual theme, Apple-compact UI |

---

## 🗂️ Project Directory Structure

```
events-app/
├── 📂 frontend/               # Next.js 16 Client & Dashboard Web App (Folajimi)
│   ├── app/                  # Next.js App Router pages (/, /dashboard, /demo, /login)
│   ├── components/           # UI components, event cards, forms, navigation
│   ├── context/              # Global application state (AppContext)
│   ├── lib/                  # Utilities, mock data, and local helper functions
│   ├── public/               # Static assets, logos, brand images
│   ├── package.json          # Frontend dependencies & scripts
│   └── README.md             # Frontend specific setup guide
│
├── 📂 backend/                # Server & API Service (Abraham)
│   ├── prisma/               # Prisma schema & PostgreSQL migration definitions
│   │   └── schema.prisma     # Models: User, Event, AttendanceRecord, Lead, Product
│   ├── src/
│   │   ├── db/               # Prisma client singleton and database seed script
│   │   ├── middleware/       # Auth guards, @thefifthlab.com domain filter, error handlers
│   │   ├── routes/           # API routes (events, leads, products, auth)
│   │   ├── services/         # Nodemailer email dispatch, QR code badge generator
│   │   └── index.ts          # Express API server entry point
│   ├── .env.example          # Environment variables template (Neon DB, NextAuth, Azure AD)
│   ├── package.json          # Backend dependencies & scripts
│   └── README.md             # Backend specific setup guide
│
└── 📂 shared/                 # Shared TypeScript Definitions
    ├── types.ts              # Data contracts, event models, user roles, lead statuses
    ├── constants.ts          # Event categories, priorities, FifthLab solution definitions
    └── index.ts              # Central export barrel
```

---

## 🚀 Getting Started

Both frontend and backend are standalone modules. Navigate into whichever folder corresponds to your role:

### Running the Frontend (Folajimi)
```bash
cd frontend
npm install
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

### Running the Backend (Abraham)
```bash
cd backend
npm install
cp .env.example .env
npm run prisma:generate
npm run dev
```
API runs on **[http://localhost:5000](http://localhost:5000)**.
