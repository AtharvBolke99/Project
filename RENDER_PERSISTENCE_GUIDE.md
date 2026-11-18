# Conceptifyyy Render Persistent Storage Configuration Guide

## Architecture Overview

Conceptifyyy uses an ultra-fast, zero-database, file-based persistence architecture. All store products, notes, metadata, and uploaded documents are stored in:
- `products.json` — Centralized product catalog metadata.
- `uploads/pdfs/` — Real uploaded documents (`.pdf`, `.zip`, `.docx`, `.pptx`, `.csv`).
- `uploads/thumbnails/` — Uploaded preview images (`.png`, `.jpg`, `.jpeg`, `.webp`).

---

## Why Ephemeral Disks Cause Bugs on Cloud Platforms

On Render's default free-tier container:
1. Every container restart or git redeployment boots from a fresh container image built from the Git repository.
2. Any files created or deleted while the server was running on the local container disk (`server/data/store/`) will be discarded if no persistent disk is mounted.
3. This is why previously deleted products could reappear after a git push if the git repo contained older seed data!

---

## The Permanent Solution: Render Persistent Disk

By attaching a persistent disk:
- The disk directory is mounted at `/var/data/store`.
- Changes to `products.json`, newly uploaded PDFs, and deletions **survive 100% across git redeployments, container restarts, and manual rebuilds**.
- Git deployments only update the application source code (`dist/`), leaving the mounted `/var/data/store` completely untouched.

### Configuration in `render.yaml` (Already Added)
```yaml
services:
  - type: web
    name: conceptifyyy-backend
    env: node
    plan: starter
    disk:
      name: conceptifyyy-store-data
      mountPath: /var/data/store
      sizeGB: 1
    envVars:
      - key: STORE_DATA_PATH
        value: /var/data/store
```

### Manual Configuration via Render Web Dashboard (Step-by-Step)
If your service was created manually in the Render dashboard instead of via `render.yaml`:
1. Open [dashboard.render.com](https://dashboard.render.com).
2. Click on your backend web service (`conceptifyyy-backend`).
3. In the left navigation menu, click **Disks**.
4. Click **Add Disk**:
   - **Name**: `conceptifyyy-store-data`
   - **Mount Path**: `/var/data/store`
   - **Size**: `1 GB` (or more as your PDF catalog grows)
5. Go to the **Environment** tab on the left menu and add:
   - **Key**: `STORE_DATA_PATH`
   - **Value**: `/var/data/store`
6. Click **Save Changes**. Render will automatically restart the service with the disk attached.

---

## How `StoreStorage` Handles Cold-Starts Gracefully

When the disk is attached for the very first time:
1. `StoreStorage.init()` detects `/var/data/store` is empty.
2. It seeds the 7 genuine placement materials from `server/data/store/products.json` and copies default template files into `/var/data/store/uploads/` automatically.
3. From that moment on, `/var/data/store` is the sole source of truth.
4. When an admin adds a product, edits a product, or permanently deletes a product:
   - Writes are performed atomically using a temporary file (`.products.json.tmp`) and renamed into place, preventing any JSON corruption.
   - Deleted products are permanently stripped from `products.json` and unlinked from the physical disk (`safeDeleteUploadFile`).
   - Old products will **never** be re-seeded or resurrected.

---

## Admin Backup & Offline Restoration

In the Admin Dashboard (`/admin/products`):
- **Export Backup**: Downloads a timestamped JSON snapshot (`conceptifyyy-products-backup-YYYY-MM-DD.json`) of the entire active catalog.
- **Restore Backup**: Allows instant one-click restoration of all product metadata from any valid JSON backup file.
