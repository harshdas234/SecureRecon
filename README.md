# SecureRecon

> **"Web Application Security, Simplified."**

SecureRecon is a professional web application security assessment and vulnerability management platform designed exclusively for authorized web applications.

---

## Architecture Overview

- **Frontend**: React + Vite + Three.js (WebGL 3D Shield Logo) + Vanilla CSS Cyber Design System.
- **Backend**: Python FastAPI with SQLAlchemy 2.0 (Dual SQLite/PostgreSQL architecture), Starlette WebSockets, and Pydantic v2 schemas.
- **Scanning Engine**: Safe, controlled passive inspection (HTTP response security headers, cookie flags, form CSRF, client script secret detection) and authentic demo assessment simulation.
- **Containerization**: Complete Docker & Docker Compose setup (`docker/docker-compose.yml`).

---

## Quick Start (Local)

### 1. Start Backend
```powershell
uvicorn backend.main:app --host 127.0.0.1 --port 8000
```
- API Documentation: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
- Health Check: [http://127.0.0.1:8000/api/health](http://127.0.0.1:8000/api/health)

### 2. Start Frontend
```powershell
cd frontend
npm install
npm run dev
```
- Web Application: [http://localhost:5173/](http://localhost:5173/)

---

## Running with Docker Compose

```bash
docker-compose -f docker/docker-compose.yml up --build
```
This launches:
- PostgreSQL database on port 5432
- SecureRecon FastAPI backend on port 8000
- Nginx frontend production container on port 5173

---

## Deploying to Vercel

SecureRecon is fully pre-configured for instant zero-configuration deployment on **Vercel**:
- Root and frontend `vercel.json` configurations with SPA rewrite routing
- Dynamic backend and WebSocket URL configuration (`VITE_API_BASE` and `VITE_WS_BASE`)
- Serverless Python API entrypoint (`api/index.py`)
- Full offline fallback mode for instant demos

See [DEPLOY_VERCEL.md](file:///c:/Users/rm809/Desktop/ARP%20PROJECT/DEPLOY_VERCEL.md) for full click-by-click instructions.

---

## Running Automated Tests

```powershell
python -m unittest discover tests -v
```

All 10 tests validate URL scope boundary enforcement, CIDR/IP blocks, passive header rules, and API endpoints.
