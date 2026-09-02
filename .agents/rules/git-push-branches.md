# Multi-Branch Git Push Rules

## Applicability
Apply these rules whenever working in a repository that contains the branch structure:
- `main` (Production deployment branch)
- `frontend/core` (Frontend feature & UI branch)
- `backend/core` (Backend services & database branch)

---

## Mandatory Push Protocol
Whenever the user requests to **push**, **deploy**, or **sync updates** to GitHub:

1. **Stage & Commit on Working Branch**:
   - Inspect status: `git status`
   - Stage appropriate files: `git add <paths>`
   - Commit with conventional commit message: `git commit -m "<type>: <description>"`
   - Push working branch: `git push origin <working-branch>` (e.g. `frontend/core`)

2. **Synchronize & Push `main` (Production)**:
   - Switch to `main`: `git checkout main`
   - Merge the updated working branch: `git merge <working-branch> --no-edit`
   - Push production branch: `git push origin main` (Triggers production Vercel/cloud deployment)

3. **Synchronize & Push `backend/core`**:
   - Switch to `backend/core`: `git checkout backend/core`
   - Fast-forward / merge `main`: `git merge main --no-edit`
   - Push backend branch: `git push origin backend/core`

4. **Restore Original Branch**:
   - Switch back to the active working branch: `git checkout <working-branch>`
   - Confirm branch state: `git status`

---

## One-Line Command Sequence
```powershell
git push origin <working-branch>; git checkout main; git merge <working-branch> --no-edit; git push origin main; git checkout backend/core; git merge main --no-edit; git push origin backend/core; git checkout <working-branch>
```

Never leave `main` or `backend/core` un-pushed when the user asks to push updates.
