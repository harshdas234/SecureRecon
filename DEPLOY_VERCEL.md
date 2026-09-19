# Deploying SecureRecon to Vercel

This guide walks you through deploying the **SecureRecon** Web Application Security Assessment & Vulnerability Management platform to [Vercel](https://vercel.com).

---

## 🚀 Quick Deployment Options

| Approach | Frontend | Backend | WebSockets | Recommended For |
| :--- | :--- | :--- | :--- | :--- |
| **Option A (Recommended)** | Vercel (Global Edge CDN) | Render / Railway / Fly.io / VPS | ✅ Real-time persistent | Production & full assessment engine |
| **Option B (Instant Demo)** | Vercel (Global Edge CDN) | Built-in Client Simulation | ✅ Dynamic simulation feed | Demos, client presentations, UI testing |
| **Option C (Serverless Python)**| Vercel (Global Edge CDN) | Vercel Serverless (`/api`) | ⚠️ HTTP API only (no WS) | Lightweight REST API calls |

---

## 📦 Option A: Deploy via Vercel Dashboard (Recommended)

### Step 1: Push Project to GitHub / GitLab / Bitbucket
Ensure your project repository is committed and pushed to your Git provider:
```bash
git add .
git commit -m "Configure SecureRecon for Vercel deployment"
git push origin main
```

### Step 2: Import Project in Vercel
1. Log in to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** ➜ **Project**.
3. Select your Git repository and click **Import**.

### Step 3: Configure Project Settings
Vercel will auto-detect settings thanks to our root `vercel.json` and `package.json`:
- **Framework Preset**: `Vite`
- **Root Directory**: `./` *(or set to `frontend` if deploying frontend only)*
- **Build Command**: `cd frontend && npm install && npm run build` (auto-filled)
- **Output Directory**: `frontend/dist` (auto-filled)

### Step 4: Environment Variables (Optional)
Under **Environment Variables**, you can add:
- `VITE_API_BASE`: URL of your backend API (e.g., `https://your-backend.onrender.com/api`).
- `VITE_WS_BASE`: URL of your backend WebSocket server (e.g., `wss://your-backend.onrender.com`).

*(If left blank, SecureRecon automatically operates in high-fidelity standalone demo mode with all 3D visuals, interactive dashboard metrics, scan simulations, and vulnerability management active!)*

### Step 5: Deploy
Click **Deploy**. In under 60 seconds, your SecureRecon platform will be live at:
`https://your-project-name.vercel.app`

---

## ⚡ Option B: Deploy via Vercel CLI

If you have Node.js and the Vercel CLI installed:

```bash
# Install Vercel CLI globally if not already installed
npm install -g vercel

# From the project root:
vercel
```

Follow the prompts:
- **Set up and deploy?** `Y`
- **Which scope?** (Select your account)
- **Link to existing project?** `N`
- **Project name?** `securerecon`
- **Directory located?** `./`
- **Want to modify settings?** `N`

To deploy straight to production:
```bash
vercel --prod
```

---

## 🌐 Deploying the FastAPI Backend (for Live Scans & WebSockets)

Because Vercel serverless functions terminate persistent connections, long-lived WebSockets (`/ws/scans/{id}`) and active multi-stage security crawlers run best on a persistent container service.

You can deploy the backend in **2 minutes** for free or low-cost using the included `docker/Dockerfile.backend`:

### Deploying to Render.com (1-Click Container)
1. Go to [Render Dashboard](https://dashboard.render.com/) ➜ **New** ➜ **Web Service**.
2. Connect your Git repository.
3. Choose **Docker** as runtime:
   - **Dockerfile Path**: `docker/Dockerfile.backend`
   - **Docker Context**: `.`
4. Environment Variables:
   - `DATABASE_URL`: (Optional; defaults to SQLite, or connect a managed PostgreSQL instance)
   - `SECRET_KEY`: `your_random_production_secret_key`
   - `ALLOWED_ORIGINS`: `https://your-project-name.vercel.app`
5. Click **Deploy Web Service**.
6. Once deployed, copy your Render URL (e.g., `https://securerecon-backend.onrender.com`).

### Linking Frontend to Backend
Back in your **Vercel Dashboard** ➜ **Settings** ➜ **Environment Variables**:
- `VITE_API_BASE` = `https://securerecon-backend.onrender.com/api`
- `VITE_WS_BASE` = `wss://securerecon-backend.onrender.com`

Trigger a Redeploy on Vercel (`Deployments` ➜ `Redeploy`). Your frontend is now connected to your live FastAPI backend with real-time assessment streaming!

---

## 🛠️ Configuration Files Included in this Repo

- **`vercel.json`** (Root): Auto-configures Vite build, output directory, and SPA rewrite rules for monorepo root deployment.
- **`frontend/vercel.json`**: SPA fallback routing rule (`/*` ➜ `/index.html`) so refreshing routes like `/dashboard` or `/vulnerabilities` never 404s.
- **`frontend/.env.example`**: Documentation of available client environment variables.
- **`api/index.py`**: Vercel Serverless Function entry point for FastAPI routes.
- **`requirements.txt`**: Python dependencies auto-installed by Vercel for Serverless functions.
- **`docker/Dockerfile.backend`**: Production container for deploying the backend on Render, Railway, or AWS.

---

## 🔒 Security & Verification Checklist

- [x] **SPA Routing**: Configured rewrite rules prevent 404 errors on page refresh.
- [x] **CORS Configuration**: Backend allows Vercel preview and production URLs (`*.vercel.app`).
- [x] **Standalone Resilience**: The frontend gracefully falls back to dynamic client simulations if the backend is waking up or offline.
- [x] **Dual DB Mode**: Auto-falls back to `/tmp/securerecon.db` in serverless environments to prevent read-only filesystem errors.
