# Repository Agent Guidelines

## Git Branching & Push Protocol
This repository uses a multi-branch architecture:
- `main`: Connected to Vercel Production deployment.
- `frontend/core`: Active frontend development branch.
- `backend/core`: Backend and API development branch.

### Mandatory Rule for Git Push Requests
Whenever the user asks to "push", "push updates", or deploy changes:
1. Commit and push the current working branch (e.g. `frontend/core`):
   ```bash
   git push origin frontend/core
   ```
2. Merge the latest changes into `main` and push to trigger production deployment:
   ```bash
   git checkout main
   git merge frontend/core --no-edit
   git push origin main
   ```
3. Merge `main` into `backend/core` and push to keep the backend branch fully synchronized:
   ```bash
   git checkout backend/core
   git merge main --no-edit
   git push origin backend/core
   ```
4. Return to `frontend/core` (or the previous working branch):
   ```bash
   git checkout frontend/core
   ```

**Never push only `frontend/core` without also merging and pushing to `main` and `backend/core`.**

## Card Design System Rules
- **NEVER use cards with top colored accent borders** (e.g. `border-t-4`, `border-t-[color]`, top colored accent lines or wedges).
- **NEVER use asymmetric thick colored top borders** or garish tinted gradient headers on KPI / metric cards.
- Cards must use a clean, uniform enterprise style: consistent borders (`border border-slate-200`), clean white background (`bg-white`), subtle shadow (`shadow-2xs` or `shadow-none`), and crisp typography.

## Pill Tag & Badge Design Rules
- **NEVER use colored pill/tag/badge designs** with tinted background fills and colored borders (e.g. `bg-purple-50 border border-purple-200`, `bg-[#EAF7F7] border border-[#CEEFEF]`, or similar candy/pastel pill tags).
- Display table data, roles, and metadata in clean, understated typography (e.g. `font-medium text-slate-700` or plain text) without pill containers or tinted background tags.

