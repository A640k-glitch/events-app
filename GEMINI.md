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
