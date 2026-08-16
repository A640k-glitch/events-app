# 🚀 FifthLab Events — Backend Service

> ⚠️ **CRITICAL REMINDER FOR ABRAHAM:**
> **Always work on the `backend/core` branch.** Do **NOT** commit or push directly to `main`.
> Verify before coding: `git branch` (should show `* backend/core`).

**Backend Lead:** Abraham Akinwole (`abraham.akinwole@thefifthlab.com`)  
**Dedicated Branch:** `backend/core`  
**Stack:** Node.js, Express, TypeScript, Prisma ORM, Neon PostgreSQL (Serverless), Nodemailer, QRCode

---

## 📁 Directory Layout

```
backend/
├── prisma/
│   └── schema.prisma         # Full database models (Users, Events, Manifest, Leads, Products)
├── src/
│   ├── db/
│   │   ├── prisma.ts         # Prisma client singleton
│   │   └── seed.ts           # Database migration & seed script
│   ├── middleware/
│   │   ├── auth.middleware.ts  # NextAuth / @thefifthlab.com domain guard + dev bypass
│   │   └── error.middleware.ts # Centralized error handler
│   ├── routes/
│   │   ├── events.routes.ts   # CRUD, filters, staff RSVP, QR badge generation
│   │   ├── leads.routes.ts    # Public demo bookings, protected lead management, CSV export
│   │   ├── products.routes.ts # Solution catalog & demo slots
│   │   └── auth.routes.ts     # User profile & staff directory
│   ├── services/
│   │   ├── email.service.ts   # Nodemailer Gmail SMTP notifications
│   │   └── qr.service.ts      # Attendee QR badge generator
│   └── index.ts               # Express server entry point
├── .env.example               # Environment variables template
├── package.json               # Backend dependencies and scripts
└── tsconfig.json              # TypeScript configuration
```

---

## ⚡ Quick Start for Backend Team

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Update `DATABASE_URL` with your Neon PostgreSQL connection string.

### 3. Initialize Database & Seed Data
```bash
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
```

### 4. Start Development Server
```bash
npm run dev
```
Server runs on **`http://localhost:5000`**.

---

## 🔌 API Endpoints Summary

| Method | Endpoint | Access | Description |
|---|---|---|---|
| `GET` | `/api/health` | Public | Health check |
| `GET` | `/api/events` | Public | List events with category & priority filters |
| `GET` | `/api/events/:id` | Public | Single event detail + attendance manifest |
| `POST` | `/api/events` | Protected | Create new event |
| `POST` | `/api/events/:id/rsvp` | Protected | Staff RSVP to an event |
| `GET` | `/api/events/:id/badge/:userId` | Public | Generate QR Code Badge |
| `POST` | `/api/leads` | Public | Submit demo booking / lead capture form |
| `GET` | `/api/leads` | Protected | List all leads with filters & search |
| `PATCH` | `/api/leads/:id` | Protected | Update lead status / notes / assigned owner |
| `GET` | `/api/leads/export` | Protected | Download leads as CSV |
| `GET` | `/api/products` | Public | List FifthLab solutions |
| `POST` | `/api/products` | Admin | Add new solution to catalog |
