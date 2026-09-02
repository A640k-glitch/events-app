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
