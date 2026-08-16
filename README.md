# 🏢 Fifth Events — Enterprise Event & Lead Management Platform

> # 🚨🚨 CRITICAL TEAM RULE — READ BEFORE WRITING ANY CODE 🚨🚨
> 
> ### 🛑 DO NOT WRITE CODE OR PUSH ON THE `main` BRANCH!
> - The `main` branch is connected directly to **Vercel Production Auto-Deployment**.
> - Working or pushing directly to `main` **WILL BREAK PRODUCTION**.
> 
> ### ✅ MANDATORY FIRST STEP EVERY MORNING:
> Run this command in your terminal before typing any code:
> ```bash
> git branch
> ```
> - If you are **Abraham (Backend)**, the star `*` **MUST** be on `backend/core`.
> - If you are **Folajimi (Frontend)**, the star `*` **MUST** be on `frontend/core`.
> - If you see `* main`, **IMMEDIATELY** run:
>   - For Abraham: `git checkout backend/core`
>   - For Folajimi: `git checkout frontend/core`

---

## 👥 Team & Ownership

| Role | Team Member | Primary Directory | Dedicated Git Branch |
|---|---|---|---|
| **Backend & Database** | **Abraham Akinwole** | [`backend/`](./backend/) | `backend/core` |
| **Frontend & UI/UX** | **Folajimi Ajayi** | [`frontend/`](./frontend/) | `frontend/core` |

---

## 🌿 Git Branching & Collaboration Workflow

```mermaid
gitGraph
    commit id: "main (Production)"
    branch backend/core
    branch frontend/core
    checkout backend/core
    commit id: "backend feature"
    checkout frontend/core
    commit id: "frontend feature"
    checkout main
    merge backend/core id: "PR: Merge Backend"
    merge frontend/core id: "PR: Merge Frontend"
```

---

### 🚀 Step-by-Step Instructions per Member

### 1️⃣ For Abraham (Backend Lead)

#### 🔹 Day 1 / First-time Setup:
```bash
git fetch origin
git checkout backend/core
cd backend
npm install
cp .env.example .env
npm run prisma:generate
```

#### 🔹 Daily Work Routine:
```bash
# 1. Ensure you are on backend/core and synced with main
git checkout backend/core
git pull origin main

# 2. Work ONLY inside the backend/ folder

# 3. Commit your changes
git add backend/
git commit -m "feat(backend): implement event rsvp endpoints"

# 4. Push to remote backend branch
git push origin backend/core
```

#### 🔹 Pre-Merge Verification (Must pass before merging to `main`):
```bash
cd backend
npx tsc --noEmit        # Must exit with 0 TypeScript errors
npm run dev             # Verify API server starts cleanly on :5000
```

---

### 2️⃣ For Folajimi (Frontend Lead)

#### 🔹 Day 1 / First-time Setup:
```bash
git fetch origin
git checkout frontend/core
cd frontend
npm install
```

#### 🔹 Daily Work Routine:
```bash
# 1. Ensure you are on frontend/core and synced with main
git checkout frontend/core
git pull origin main

# 2. Work ONLY inside the frontend/ folder

# 3. Commit your changes
git add frontend/
git commit -m "feat(frontend): redesign public event cards"

# 4. Push to remote frontend branch
git push origin frontend/core
```

#### 🔹 Pre-Merge Verification (Must pass before merging to `main`):
```bash
cd frontend
npm run build           # Must compile with 0 errors (Turbopack)
```

---

### 3️⃣ Merging Changes to `main` (Production Release)

1. Open GitHub repository -> **Pull Requests** -> **New Pull Request**.
2. Set **Base:** `main` ⟵ **Compare:** `backend/core` or `frontend/core`.
3. Verify tests and click **Create Pull Request**.
4. Once merged, Vercel automatically deploys the updated code to production without downtime.

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

## ⚡ Local Development Quick Reference

### Frontend:
```bash
cd frontend && npm run dev
```
> Runs on **`http://localhost:3000`**

### Backend:
```bash
cd backend && npm run dev
```
> Runs on **`http://localhost:5000`**
