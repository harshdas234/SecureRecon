import asyncio
from datetime import datetime
from typing import Dict, List, Any
from sqlalchemy.orm import Session

from backend.models.models import (
    Scan, ScanJob, Page, Form, FormField, JavascriptFile,
    Cookie, SecurityHeader, Technology, Screenshot, Finding,
    AiAnalysis, Report, Notification, AuditLog
)

class ScanPipelineSimulator:
    """
    Simulates a controlled, authorized web application security assessment
    following the strictly defined 8-stage pipeline:
    1. Website Connection
    2. Page Discovery
    3. HTML Analysis
    4. Form Analysis
    5. Cookie Analysis
    6. JavaScript Analysis
    7. Security Headers
    8. Finding Analysis / Report
    """

    STAGES = [
        ("Website Connection", 12),
        ("Page Discovery", 25),
        ("HTML Analysis", 40),
        ("Form Analysis", 55),
        ("Cookie Analysis", 68),
        ("JavaScript Analysis", 80),
        ("Security Headers", 92),
        ("Finding Analysis", 100),
    ]

    SAMPLE_PAGES = [
        {"path": "/", "title": "SecureRecon Demo Portal - Enterprise Landing", "status_code": 200, "resp": 118, "forms": 1, "links": 18, "headers": 11},
        {"path": "/login", "title": "SecureRecon Authentication Gateway", "status_code": 200, "resp": 95, "forms": 1, "links": 6, "headers": 10},
        {"path": "/dashboard", "title": "Management Console - Security Visibility", "status_code": 200, "resp": 142, "forms": 0, "links": 24, "headers": 9},
        {"path": "/account/profile", "title": "User Profile Settings & Token Controls", "status_code": 200, "resp": 130, "forms": 2, "links": 12, "headers": 8},
        {"path": "/api/v1/health", "title": "Application Health Metric Endpoint", "status_code": 200, "resp": 45, "forms": 0, "links": 0, "headers": 7},
        {"path": "/billing/invoices", "title": "Client Invoice Ledger", "status_code": 200, "resp": 160, "forms": 1, "links": 8, "headers": 9},
        {"path": "/docs/api-guide", "title": "API Developer Guide & Integration Reference", "status_code": 200, "resp": 110, "forms": 0, "links": 32, "headers": 8},
    ]

    @classmethod
    async def run_simulation(cls, db: Session, scan_id: str, ws_manager=None):
        scan = db.query(Scan).filter(Scan.id == scan_id).first()
        if not scan:
            return

        scan.status = "running"
        scan.started_at = datetime.utcnow()
        db.commit()

        base_url = scan.website.url.rstrip("/")

        created_pages = []

        for stage_idx, (stage_name, target_progress) in enumerate(cls.STAGES):
            scan.current_stage = stage_name
            scan.progress = target_progress - 8
            
            # Log scan job
            job = ScanJob(
                scan_id=scan.id,
                stage=stage_name,
                status="active",
                details=f"Executing pipeline phase: {stage_name} on {base_url}"
            )
            db.add(job)
            db.commit()

            # Emit stage started event
            if ws_manager:
                await ws_manager.broadcast_scan_event(scan.id, {
                    "type": "stage_update",
                    "stage": stage_name,
                    "progress": scan.progress,
                    "message": f"Starting {stage_name}...",
                    "timestamp": datetime.utcnow().isoformat()
                })

            await asyncio.sleep(0.6)

            # Stage-specific population
            if stage_name == "Website Connection":
                scan.current_url = base_url
                if ws_manager:
                    await ws_manager.broadcast_scan_event(scan.id, {
                        "type": "log",
                        "level": "info",
                        "message": f"Established TLS 1.3 session with {base_url} (HTTP/2.0 negotiation verified)",
                        "timestamp": datetime.utcnow().isoformat()
                    })

            elif stage_name == "Page Discovery":
                for p_data in cls.SAMPLE_PAGES:
                    page_url = f"{base_url}{p_data['path']}"
                    scan.current_url = page_url
                    scan.pages_analyzed += 1
                    page = Page(
                        scan_id=scan.id,
                        website_id=scan.website_id,
                        url=page_url,
                        path=p_data["path"],
                        status_code=p_data["status_code"],
                        title=p_data["title"],
                        response_time_ms=p_data["resp"],
                        forms_count=p_data["forms"],
                        links_count=p_data["links"],
                        headers_count=p_data["headers"]
                    )
                    db.add(page)
                    db.commit()
                    created_pages.append(page)

                    if ws_manager:
                        await ws_manager.broadcast_scan_event(scan.id, {
                            "type": "page_discovered",
                            "url": page_url,
                            "status": p_data["status_code"],
                            "pages_analyzed": scan.pages_analyzed,
                            "message": f"Discovered route: {p_data['path']} [{p_data['status_code']}]",
                            "timestamp": datetime.utcnow().isoformat()
                        })
                    await asyncio.sleep(0.3)

            elif stage_name == "HTML Analysis":
                # Add detected technologies and screenshot
                tech_data = [
                    {"name": "React", "category": "JavaScript Library", "version": "18.3.1", "confidence": 99, "icon": "react"},
                    {"name": "Vite", "category": "Build Tool", "version": "5.4.0", "confidence": 95, "icon": "zap"},
                    {"name": "FastAPI", "category": "Backend Framework", "version": "0.115.0", "confidence": 96, "icon": "server"},
                    {"name": "Nginx", "category": "Web Server / Reverse Proxy", "version": "1.25.4", "confidence": 90, "icon": "cpu"},
                    {"name": "Tailwind CSS", "category": "CSS Framework", "version": "None (Vanilla CSS Native)", "confidence": 100, "icon": "palette"},
                ]
                for t in tech_data:
                    tech = Technology(
                        scan_id=scan.id,
                        website_id=scan.website_id,
                        name=t["name"],
                        category=t["category"],
                        version=t["version"],
                        confidence=t["confidence"],
                        icon=t["icon"]
                    )
                    db.add(tech)

                # Add screenshots
                for cp in created_pages[:3]:
                    shot = Screenshot(
                        scan_id=scan.id,
                        page_id=cp.id,
                        url=cp.url,
                        viewport="Desktop (1440x900)",
                        image_path=f"/screenshots/demo_{cp.path.replace('/', '_') or 'home'}.webp"
                    )
                    db.add(shot)
                db.commit()

                if ws_manager:
                    await ws_manager.broadcast_scan_event(scan.id, {
                        "type": "log",
                        "level": "info",
                        "message": "HTML semantic hierarchy verified. 5 web framework components fingerprinted.",
                        "timestamp": datetime.utcnow().isoformat()
                    })

            elif stage_name == "Form Analysis":
                # Add forms for login and profile
                if created_pages:
                    login_p = next((p for p in created_pages if p.path == "/login"), created_pages[0])
                    f1 = Form(
                        scan_id=scan.id,
                        page_id=login_p.id,
                        action=f"{base_url}/api/auth/login",
                        method="POST",
                        has_csrf=False,
                        password_inputs_count=1,
                        inputs_count=3,
                        form_html='<form action="/api/auth/login" method="POST"><input type="email" name="email"/><input type="password" name="password"/><button type="submit">Sign In</button></form>'
                    )
                    db.add(f1)
                    db.flush()
                    db.add(FormField(form_id=f1.id, name="email", input_type="email", is_required=True, autocomplete_val="username"))
                    db.add(FormField(form_id=f1.id, name="password", input_type="password", is_required=True, autocomplete_val="off"))

                    profile_p = next((p for p in created_pages if p.path == "/account/profile"), created_pages[0])
                    f2 = Form(
                        scan_id=scan.id,
                        page_id=profile_p.id,
                        action=f"{base_url}/api/user/update-profile",
                        method="POST",
                        has_csrf=True,
                        password_inputs_count=0,
                        inputs_count=4,
                        form_html='<form action="/api/user/update-profile" method="POST"><input type="hidden" name="_csrf_token" value="..."/><input type="text" name="display_name"/></form>'
                    )
                    db.add(f2)
                    db.flush()
                    db.add(FormField(form_id=f2.id, name="display_name", input_type="text", is_required=True, autocomplete_val="name"))
                    db.add(FormField(form_id=f2.id, name="_csrf_token", input_type="hidden", is_required=True, autocomplete_val=None))
                    db.commit()

                    if ws_manager:
                        await ws_manager.broadcast_scan_event(scan.id, {
                            "type": "log",
                            "level": "warning",
                            "message": "Form security alert: /login form missing anti-CSRF synchronizer token.",
                            "timestamp": datetime.utcnow().isoformat()
                        })

            elif stage_name == "Cookie Analysis":
                login_p = next((p for p in created_pages if p.path == "/login"), created_pages[0])
                cookies = [
                    Cookie(scan_id=scan.id, page_id=login_p.id, name="session_token", domain=base_url.replace("https://", "").replace("http://", ""), path="/", is_secure=True, is_httponly=False, same_site="Lax", expires="Session", risk_level="Medium"),
                    Cookie(scan_id=scan.id, page_id=login_p.id, name="sr_device_ctx", domain=base_url.replace("https://", "").replace("http://", ""), path="/", is_secure=True, is_httponly=True, same_site="Strict", expires="30 days", risk_level="Secure"),
                    Cookie(scan_id=scan.id, page_id=login_p.id, name="theme_pref", domain=base_url.replace("https://", "").replace("http://", ""), path="/", is_secure=False, is_httponly=False, same_site="None", expires="1 year", risk_level="Low"),
                ]
                for c in cookies:
                    db.add(c)
                db.commit()

                if ws_manager:
                    await ws_manager.broadcast_scan_event(scan.id, {
                        "type": "log",
                        "level": "info",
                        "message": "Evaluated 3 cookies: identified missing HttpOnly flag on 'session_token'.",
                        "timestamp": datetime.utcnow().isoformat()
                    })

            elif stage_name == "JavaScript Analysis":
                js_files = [
                    JavascriptFile(scan_id=scan.id, page_id=created_pages[0].id if created_pages else None, url=f"{base_url}/assets/app-bundle.min.js", filename="app-bundle.min.js", size_bytes=348210, has_sensitive_patterns=True, library_name="React Bundle", library_version="18.3.1", is_outdated=False),
                    JavascriptFile(scan_id=scan.id, page_id=created_pages[0].id if created_pages else None, url=f"{base_url}/assets/vendor-legacy.js", filename="vendor-legacy.js", size_bytes=184920, has_sensitive_patterns=False, library_name="Lodash", library_version="4.17.15", is_outdated=True),
                    JavascriptFile(scan_id=scan.id, page_id=created_pages[0].id if created_pages else None, url=f"{base_url}/assets/analytics.js", filename="analytics.js", size_bytes=42100, has_sensitive_patterns=False, library_name="Custom Analytics", library_version="1.0.2", is_outdated=False),
                ]
                for jf in js_files:
                    db.add(jf)
                db.commit()

                # Register findings for JS
                critical_finding = Finding(
                    scan_id=scan.id,
                    website_id=scan.website_id,
                    page_id=created_pages[3].id if len(created_pages) > 3 else None,
                    title="Client-Side Security Issue: Sensitive API Token Pattern Exposed",
                    severity="Critical",
                    category="Client-Side Security",
                    affected_url=f"{base_url}/account/profile",
                    evidence="const VITE_ANALYTICS_KEY = 'sk_live_9488a91f0...'; detected in minified bundle script.",
                    description="A hardcoded high-privilege service credential token was detected embedded in public client-side JavaScript assets.",
                    impact="Unauthorized threat actors can extract the embedded API secret and invoke backend management interfaces.",
                    remediation="Immediately revoke the exposed secret token, rotate all related credentials, and migrate authenticated actions to protected server-side endpoints.",
                    status="Open",
                    cvss_score=9.1
                )
                db.add(critical_finding)
                scan.findings_count += 1
                db.commit()

                if ws_manager:
                    await ws_manager.broadcast_scan_event(scan.id, {
                        "type": "finding_discovered",
                        "severity": "Critical",
                        "title": critical_finding.title,
                        "url": critical_finding.affected_url,
                        "findings_count": scan.findings_count,
                        "message": f"[CRITICAL] {critical_finding.title}",
                        "timestamp": datetime.utcnow().isoformat()
                    })

            elif stage_name == "Security Headers":
                headers_list = [
                    SecurityHeader(scan_id=scan.id, page_id=created_pages[0].id if created_pages else None, header_name="Content-Security-Policy", header_value=None, is_present=False, grade="F", recommendation="Configure CSP with strict script-src and object-src directives."),
                    SecurityHeader(scan_id=scan.id, page_id=created_pages[0].id if created_pages else None, header_name="Strict-Transport-Security", header_value="max-age=31536000; includeSubDomains", is_present=True, grade="A+", recommendation="HSTS properly enforced for 1 year."),
                    SecurityHeader(scan_id=scan.id, page_id=created_pages[0].id if created_pages else None, header_name="X-Frame-Options", header_value="SAMEORIGIN", is_present=True, grade="A", recommendation="Clickjacking defense enabled via SAMEORIGIN."),
                    SecurityHeader(scan_id=scan.id, page_id=created_pages[0].id if created_pages else None, header_name="X-Content-Type-Options", header_value="nosniff", is_present=True, grade="A", recommendation="MIME-sniffing protection verified."),
                    SecurityHeader(scan_id=scan.id, page_id=created_pages[0].id if created_pages else None, header_name="Referrer-Policy", header_value=None, is_present=False, grade="F", recommendation="Set Referrer-Policy to 'strict-origin-when-cross-origin'."),
                    SecurityHeader(scan_id=scan.id, page_id=created_pages[0].id if created_pages else None, header_name="Permissions-Policy", header_value="camera=(), microphone=(), geolocation=()", is_present=True, grade="A", recommendation="Hardware interfaces restricted."),
                ]
                for h in headers_list:
                    db.add(h)

                # Add Medium Finding for Header
                med_finding = Finding(
                    scan_id=scan.id,
                    website_id=scan.website_id,
                    page_id=created_pages[2].id if len(created_pages) > 2 else None,
                    title="Missing Content Security Policy (CSP) Header",
                    severity="Medium",
                    category="Security Architecture",
                    affected_url=f"{base_url}/dashboard",
                    evidence="Response headers for /dashboard omit the Content-Security-Policy directive.",
                    description="Content-Security-Policy (CSP) provides multi-layered defenses against Cross-Site Scripting (XSS) and arbitrary resource injection.",
                    impact="Adversaries could potentially inject malicious client scripts or stylesheet assets if user-controlled input is rendered reflectively.",
                    remediation="Deploy a baseline CSP header: default-src 'self'; script-src 'self' 'nonce-...'; object-src 'none';",
                    status="Open",
                    cvss_score=5.4
                )
                db.add(med_finding)
                scan.findings_count += 1

                # Add Low Finding for Cookie
                low_finding = Finding(
                    scan_id=scan.id,
                    website_id=scan.website_id,
                    page_id=created_pages[1].id if len(created_pages) > 1 else None,
                    title="Cookie Configuration Issue: Session Identifier Without HttpOnly",
                    severity="Low",
                    category="Session Security",
                    affected_url=f"{base_url}/login",
                    evidence="Set-Cookie: session_token=...; Path=/; Secure; SameSite=Lax (Missing HttpOnly)",
                    description="The session identifier cookie is issued without the HttpOnly attribute, rendering it readable via Document.cookie.",
                    impact="If an XSS flaw exists anywhere on the domain, user sessions can be hijacked through script extraction.",
                    remediation="Add the 'HttpOnly' flag to the Set-Cookie response header for all authenticated tokens.",
                    status="Open",
                    cvss_score=3.8
                )
                db.add(low_finding)
                scan.findings_count += 1
                db.commit()

                if ws_manager:
                    await ws_manager.broadcast_scan_event(scan.id, {
                        "type": "finding_discovered",
                        "severity": "Medium",
                        "title": med_finding.title,
                        "url": med_finding.affected_url,
                        "findings_count": scan.findings_count,
                        "message": f"[MEDIUM] {med_finding.title}",
                        "timestamp": datetime.utcnow().isoformat()
                    })

            elif stage_name == "Finding Analysis":
                # Final synthesis: calculate score and generate AI analysis + report
                scan.security_score = 82
                scan.website.last_score = 82
                
                # Generate AI analysis
                ai = AiAnalysis(
                    scan_id=scan.id,
                    executive_summary=(
                        f"SecureRecon completed a comprehensive web application assessment of {base_url}. "
                        "The application maintains an overall Security Posture Score of 82/100. "
                        "Key strengths include robust transport layer encryption (HSTS A+) and anti-clickjacking framing controls. "
                        "However, immediate remediation is required for a critical client-side credential exposure on /account/profile, "
                        "along with deploying Content-Security-Policy headers across the authenticated management surface."
                    ),
                    risk_score=78,
                    risk_level="Elevated",
                    key_observations=[
                        {"title": "Client-Side Secrets", "status": "Critical", "detail": "Exposed API key token pattern in bundled profile scripts."},
                        {"title": "Cryptographic Posture", "status": "Secure", "detail": "HSTS correctly enforced with includeSubDomains."},
                        {"title": "Anti-Clickjacking", "status": "Secure", "detail": "X-Frame-Options set to SAMEORIGIN."},
                        {"title": "CSP Protection", "status": "Attention", "detail": "Missing CSP directives on authenticated routes."},
                        {"title": "Cookie Hardening", "status": "Attention", "detail": "HttpOnly flag omitted on session_token."}
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

                # Generate default Technical Report
                report = Report(
                    scan_id=scan.id,
                    project_id=scan.project_id,
                    title=f"SecureRecon Web Security Assessment - {scan.website.name}",
                    report_type="Technical Web Security Report",
                    format="HTML",
                    security_score=82,
                    summary_json={
                        "website": scan.website.name,
                        "url": scan.website.url,
                        "pages_analyzed": scan.pages_analyzed,
                        "score": 82,
                        "critical": 1,
                        "high": 0,
                        "medium": 1,
                        "low": 1,
                        "informational": 0
                    }
                )
                db.add(report)

                # Notification
                notif = Notification(
                    title="Assessment Complete",
                    message=f"SecureRecon assessment for '{scan.website.name}' concluded with Security Score 82/100.",
                    level="success",
                    link=f"/dashboard"
                )
                db.add(notif)
                db.commit()

            scan.progress = target_progress
            job.status = "completed"
            db.commit()

            if ws_manager:
                await ws_manager.broadcast_scan_event(scan.id, {
                    "type": "stage_completed",
                    "stage": stage_name,
                    "progress": scan.progress,
                    "message": f"Completed {stage_name}",
                    "timestamp": datetime.utcnow().isoformat()
                })

            await asyncio.sleep(0.4)

        scan.status = "completed"
        scan.completed_at = datetime.utcnow()
        db.commit()

        if ws_manager:
            await ws_manager.broadcast_scan_event(scan.id, {
                "type": "scan_completed",
                "status": "completed",
                "progress": 100,
                "score": scan.security_score,
                "pages_analyzed": scan.pages_analyzed,
                "findings_count": scan.findings_count,
                "message": "SecureRecon assessment successfully concluded.",
                "timestamp": datetime.utcnow().isoformat()
            })
