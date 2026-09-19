from datetime import datetime
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

from backend.core.config import settings
from backend.database.session import engine, Base, SessionLocal
from backend.models.models import (
    User, Project, Website, ScanProfile, Scan, Page, Finding,
    SecurityHeader, Cookie, JavascriptFile, Technology, AiAnalysis, Report
)
from backend.api.router import api_router
from backend.api.websocket_manager import ws_manager
from backend.api.auth import hash_password

# Initialize DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="SecureRecon - Professional Web Application Security Assessment & Vulnerability Management Platform"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix=settings.API_V1_STR)

@app.get("/")
def root():
    return {
        "product": "SecureRecon",
        "tagline": settings.TAGLINE,
        "version": settings.VERSION,
        "status": "online",
        "docs": "/docs"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "securerecon-backend",
        "timestamp": datetime.utcnow().isoformat()
    }

@app.websocket("/ws/scans/{scan_id}")
async def websocket_scan_endpoint(websocket: WebSocket, scan_id: str):
    await ws_manager.connect(scan_id, websocket)
    try:
        # Send initial handshake
        await websocket.send_json({
            "type": "connection_established",
            "scan_id": scan_id,
            "message": "Connected to SecureRecon Real-Time Assessment Feed"
        })
        while True:
            # Keep listening for any client ping
            data = await websocket.receive_text()
    except WebSocketDisconnect:
        ws_manager.disconnect(scan_id, websocket)
    except Exception:
        ws_manager.disconnect(scan_id, websocket)

@app.on_event("startup")
def seed_initial_data():
    db = SessionLocal()
    try:
        # 1. Seed admin user if not present
        admin = db.query(User).filter(User.email == "admin@securerecon.io").first()
        if not admin:
            admin = User(
                email="admin@securerecon.io",
                hashed_password=hash_password("securerecon2026"),
                full_name="Alex Mercer (Security Principal)",
                role="admin"
            )
            db.add(admin)
            db.commit()
            db.refresh(admin)

        # 2. Seed Default Project
        project = db.query(Project).first()
        if not project:
            project = Project(
                name="Cybersecurity Operations Group",
                description="Core enterprise web applications security perimeter.",
                client_name="Enterprise Security Division"
            )
            db.add(project)
            db.commit()
            db.refresh(project)

        # 3. Seed Scan Profiles
        profiles = [
            ScanProfile(name="Quick Web Check", code="quick", description="Rapid inspection of entry endpoints and perimeter security headers.", max_pages=15, max_depth=1),
            ScanProfile(name="Standard Web Assessment", code="standard", description="Balanced assessment covering headers, cookies, forms, and JavaScript assets.", max_pages=50, max_depth=3, is_default=True),
            ScanProfile(name="Deep Web Assessment", code="deep", description="Comprehensive assessment including full site crawl, script analysis, and screenshots.", max_pages=200, max_depth=5),
            ScanProfile(name="JavaScript Analysis", code="js_focus", description="Dedicated inspection for client-side API leaks, outdated libraries, and DOM security.", max_pages=40, max_depth=2),
            ScanProfile(name="Security Configuration Check", code="config", description="Targeted analysis of HTTP headers, TLS attributes, and cookie flags.", max_pages=20, max_depth=1),
        ]
        for p in profiles:
            if not db.query(ScanProfile).filter(ScanProfile.code == p.code).first():
                db.add(p)
        db.commit()

        # 4. Seed Demo Website & Google Target Example
        website = db.query(Website).filter(Website.url == "https://demo.example.test").first()
        if not website:
            website = Website(
                project_id=project.id,
                name="SecureRecon Demo Portal",
                url="https://demo.example.test",
                environment="Production",
                description="Authorized fictional demonstration target for safe security auditing.",
                tags="demo, web-app, authorized",
                is_authorized=True,
                authorized_at=datetime.utcnow(),
                last_score=82
            )
            db.add(website)
            db.commit()
            db.refresh(website)

        google_site = db.query(Website).filter(Website.url == "https://google.com").first()
        if not google_site:
            google_site = Website(
                project_id=project.id,
                name="Google Web Target (Authorized Example)",
                url="https://google.com",
                environment="Production",
                description="Global web search & application portal layer authorized assessment.",
                tags="search, public, authorized, web-app",
                is_authorized=True,
                authorized_at=datetime.utcnow(),
                last_score=88
            )
            db.add(google_site)
            db.commit()
            db.refresh(google_site)

        # 5. Seed Initial Completed Scan with realistic findings
        scan = db.query(Scan).filter(Scan.website_id == website.id).first()
        if not scan:
            scan = Scan(
                project_id=project.id,
                website_id=website.id,
                status="completed",
                progress=100,
                current_stage="Report",
                current_url="https://demo.example.test",
                pages_analyzed=42,
                findings_count=3,
                security_score=82,
                started_at=datetime.utcnow(),
                completed_at=datetime.utcnow()
            )
            db.add(scan)
            db.commit()
            db.refresh(scan)

            # Add pages
            p1 = Page(scan_id=scan.id, website_id=website.id, url="https://demo.example.test/", path="/", status_code=200, title="SecureRecon Demo Portal - Enterprise Landing", response_time_ms=118, forms_count=1, links_count=18, headers_count=11)
            p2 = Page(scan_id=scan.id, website_id=website.id, url="https://demo.example.test/login", path="/login", status_code=200, title="SecureRecon Authentication Gateway", response_time_ms=95, forms_count=1, links_count=6, headers_count=10)
            p3 = Page(scan_id=scan.id, website_id=website.id, url="https://demo.example.test/dashboard", path="/dashboard", status_code=200, title="Management Console - Security Visibility", response_time_ms=142, forms_count=0, links_count=24, headers_count=9)
            p4 = Page(scan_id=scan.id, website_id=website.id, url="https://demo.example.test/account/profile", path="/account/profile", status_code=200, title="User Profile Settings & Token Controls", response_time_ms=130, forms_count=2, links_count=12, headers_count=8)
            db.add_all([p1, p2, p3, p4])
            db.commit()

            # Add Findings matching prompt specifications
            f1 = Finding(
                scan_id=scan.id,
                website_id=website.id,
                page_id=p4.id,
                title="Client-Side Security Issue",
                severity="Critical",
                category="Client-Side Security",
                affected_url="https://demo.example.test/account/profile",
                evidence="VITE_MANAGEMENT_TOKEN = 'sk_live_demo_984f93a10'; detected in profile client bundle.",
                description="High-privilege management token pattern exposed in publicly distributed client-side JavaScript.",
                impact="Potential unauthorized privilege escalation and access to administrative cloud operations.",
                remediation="Revoke exposed credentials immediately. Move all API calls requiring authorization keys behind secure server-side proxy routes.",
                status="Open",
                cvss_score=9.1
            )
            f2 = Finding(
                scan_id=scan.id,
                website_id=website.id,
                page_id=p3.id,
                title="Missing Security Header",
                severity="Medium",
                category="Security Configuration",
                affected_url="https://demo.example.test/dashboard",
                evidence="Response header 'Content-Security-Policy' is absent from dashboard responses.",
                description="The application does not declare a Content-Security-Policy (CSP) on the dashboard route.",
                impact="Vulnerability to Cross-Site Scripting (XSS) and unauthorized resource execution in case of input reflection.",
                remediation="Configure 'Content-Security-Policy: default-src \\'self\\'; script-src \\'self\\'; frame-ancestors \\'none\\''.",
                status="Open",
                cvss_score=5.4
            )
            f3 = Finding(
                scan_id=scan.id,
                website_id=website.id,
                page_id=p2.id,
                title="Cookie Configuration Issue",
                severity="Low",
                category="Cookie Security",
                affected_url="https://demo.example.test/login",
                evidence="Set-Cookie: session_token=...; Path=/; Secure; SameSite=Lax (HttpOnly missing)",
                description="Session identification cookie does not enforce the HttpOnly security flag.",
                impact="Session token could potentially be read by rogue client scripts if an XSS flaw exists.",
                remediation="Enforce the 'HttpOnly' attribute on all authentication and session state cookies.",
                status="Open",
                cvss_score=3.8
            )
            db.add_all([f1, f2, f3])

            # Add AI Analysis
            ai = AiAnalysis(
                scan_id=scan.id,
                executive_summary=(
                    "Your latest assessment identified 7 security observations across 42 pages. "
                    "SecureRecon detected strong baseline encryption but identified a critical client-side API token exposure "
                    "along with missing CSP headers on authenticated management routes."
                ),
                risk_score=78,
                risk_level="Elevated",
                key_observations=[
                    {"title": "Client-Side Secrets", "status": "Critical", "detail": "Exposed API key token in profile bundle."},
                    {"title": "HSTS Enforced", "status": "Secure", "detail": "HSTS correctly set with max-age 31536000."},
                    {"title": "Anti-Clickjacking", "status": "Secure", "detail": "X-Frame-Options set to SAMEORIGIN."},
                    {"title": "CSP Header", "status": "Attention", "detail": "Missing CSP on dashboard route."},
                    {"title": "Cookie Hardening", "status": "Attention", "detail": "HttpOnly flag missing on session token."}
                ],
                remediation_roadmap=[
                    {"priority": "P0 (Immediate)", "action": "Revoke and rotate exposed analytics secret token on /account/profile", "effort": "1 hour"},
                    {"priority": "P1 (High)", "action": "Enforce HttpOnly flag on all Set-Cookie session headers", "effort": "2 hours"},
                    {"priority": "P2 (Medium)", "action": "Implement Content-Security-Policy with strict script-src", "effort": "1 day"},
                    {"priority": "P3 (Low)", "action": "Set Referrer-Policy to strict-origin-when-cross-origin", "effort": "30 mins"}
                ],
                recurring_issues=[
                    {"category": "Missing Headers", "count": 2, "trend": "Unchanged"},
                    {"category": "Cookie Configuration", "count": 1, "trend": "Decreased"}
                ],
                security_trends=[
                    {"month": "May", "score": 74},
                    {"month": "Jun", "score": 76},
                    {"month": "Jul", "score": 79},
                    {"month": "Aug", "score": 80},
                    {"month": "Sep", "score": 82}
                ]
            )
            db.add(ai)

            # Add Report
            rep = Report(
                scan_id=scan.id,
                project_id=project.id,
                title=f"SecureRecon Web Security Assessment - {website.name}",
                report_type="Technical Web Security Report",
                format="HTML",
                security_score=82,
                summary_json={
                    "website": website.name,
                    "url": website.url,
                    "project": project.name,
                    "pages_analyzed": 42,
                    "score": 82,
                    "critical": 1,
                    "high": 3,
                    "medium": 8,
                    "low": 5,
                    "informational": 2
                }
            )
            db.add(rep)
            db.commit()

    finally:
        db.close()
