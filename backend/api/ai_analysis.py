from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from backend.database.session import get_db
from backend.models.models import AiAnalysis, Scan
from backend.schemas.schemas import AiAnalysisOut

router = APIRouter(prefix="/ai-analysis", tags=["ai-analysis"])

@router.get("/latest", response_model=AiAnalysisOut)
def get_latest_ai_analysis(db: Session = Depends(get_db)):
    ai = db.query(AiAnalysis).order_by(AiAnalysis.created_at.desc()).first()
    if not ai:
        # Fallback default AI analysis
        ai = AiAnalysis(
            scan_id="initial-demo-scan",
            executive_summary=(
                "SecureRecon AI Engine has completed automated posture evaluation across all active web targets. "
                "Your web application environment exhibits strong foundation encryption and perimeter headers. "
                "Immediate remediation is recommended for an exposed API token pattern discovered in client-side script assets, "
                "along with missing CSP headers on authenticated administrative routes."
            ),
            risk_score=78,
            risk_level="Elevated",
            key_observations=[
                {"title": "Client-Side Secrets", "status": "Critical", "detail": "Exposed API key pattern identified in JavaScript bundles."},
                {"title": "Cryptographic Posture", "status": "Secure", "detail": "HSTS correctly configured with max-age 1 year and includeSubDomains."},
                {"title": "Anti-Clickjacking", "status": "Secure", "detail": "X-Frame-Options set to SAMEORIGIN."},
                {"title": "Content-Security-Policy", "status": "Attention", "detail": "Missing CSP directives on authenticated routes."},
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
        db.commit()
        db.refresh(ai)
    return ai

@router.get("/{scan_id}", response_model=AiAnalysisOut)
def get_ai_analysis_for_scan(scan_id: str, db: Session = Depends(get_db)):
    ai = db.query(AiAnalysis).filter(AiAnalysis.scan_id == scan_id).first()
    if not ai:
        return get_latest_ai_analysis(db)
    return ai
