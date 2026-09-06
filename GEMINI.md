# Antigravity Rules for Events App Repository

## Multi-Branch Push Protocol
Whenever the user asks to push or deploy updates:
1. Push `frontend/core`:
   ```bash
   git push origin frontend/core
   ```
2. Merge into `main` and push to trigger production deployment:
   ```bash
   git checkout main
   git merge frontend/core --no-edit
   git push origin main
   ```
3. Merge into `backend/core` and push:
   ```bash
   git checkout backend/core
   git merge main --no-edit
   git push origin backend/core
   ```
4. Return to working branch:
   ```bash
   git checkout frontend/core
   ```
Always keep `main`, `backend/core`, and `frontend/core` in sync when pushing.

## Card Design System Rules
- **NEVER use cards with top colored accent borders** (e.g. `border-t-4`, `border-t-[color]`, top accent colored bars, or top wedge lines).
- **NEVER use asymmetric thick colored top borders** or tinted gradient card headers on KPI/metric/dashboard cards.
- Cards must use a clean, uniform, professional enterprise style with consistent borders (`border border-slate-200`), clean white background (`bg-white`), subtle shadow (`shadow-2xs` or `shadow-none`), and balanced typography.

## Pill Tag & Badge Design Rules
- **NEVER use colored pill/tag/badge designs** with tinted background fills and colored borders (e.g. `bg-purple-50 border border-purple-200`, `bg-[#EAF7F7] border border-[#CEEFEF]`, or similar candy/pastel pill tags).
- Display table data, roles, and metadata in clean, understated typography (e.g. `font-medium text-slate-700` or plain text) without pill containers or tinted background tags.

