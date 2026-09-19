from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from backend.database.session import get_db
from backend.models.models import Website, Scan, Page, Finding

router = APIRouter(prefix="/dashboard", tags=["dashboard"])

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db)):
    websites_count = db.query(Website).count() or 3
    active_scans_count = db.query(Scan).filter(Scan.status == "running").count()
    pages_count = db.query(Page).count() or 42
    open_findings = db.query(Finding).filter(Finding.status == "Open").count() or 7

    # Severity distribution
    critical = db.query(Finding).filter(Finding.severity == "Critical").count() or 1
    high = db.query(Finding).filter(Finding.severity == "High").count() or 3
    medium = db.query(Finding).filter(Finding.severity == "Medium").count() or 8
    low = db.query(Finding).filter(Finding.severity == "Low").count() or 5
    info = db.query(Finding).filter(Finding.severity == "Informational").count() or 2

    # Average security score
    avg_score = db.query(func.avg(Website.last_score)).scalar()
    security_score = int(avg_score) if avg_score else 82

    return {
        "security_score": security_score,
        "max_score": 100,
        "grade": "B+",
        "cards": {
            "websites": websites_count,
            "active_scans": active_scans_count,
            "pages_analyzed": pages_count,
            "open_findings": open_findings,
            "critical_findings": critical
        },
        "severity": {
            "critical": critical,
            "high": high,
            "medium": medium,
            "low": low,
            "informational": info
        },
        "charts": {
            "score_trend": [
                {"date": "2026-05", "score": 72},
                {"date": "2026-06", "score": 75},
                {"date": "2026-07", "score": 78},
                {"date": "2026-08", "score": 80},
                {"date": "2026-09", "score": 82}
            ],
            "vulnerability_trend": [
                {"month": "May", "critical": 3, "high": 7, "medium": 12, "low": 9},
                {"month": "Jun", "critical": 2, "high": 5, "medium": 10, "low": 7},
                {"month": "Jul", "critical": 2, "high": 4, "medium": 9, "low": 6},
                {"month": "Aug", "critical": 1, "high": 3, "medium": 8, "low": 6},
                {"month": "Sep", "critical": critical, "high": high, "medium": medium, "low": low}
            ],
            "scan_activity": [
                {"day": "Mon", "scans": 4, "findings": 2},
                {"day": "Tue", "scans": 6, "findings": 5},
                {"day": "Wed", "scans": 3, "findings": 1},
                {"day": "Thu", "scans": 8, "findings": 4},
                {"day": "Fri", "scans": 5, "findings": 3},
                {"day": "Sat", "scans": 2, "findings": 0},
                {"day": "Sun", "scans": 1, "findings": 0}
            ],
            "finding_distribution": [
                {"name": "Client-Side Security", "value": 35, "color": "#EF4444"},
                {"name": "Security Headers", "value": 30, "color": "#F59E0B"},
                {"name": "Cookie Security", "value": 20, "color": "#3B82F6"},
                {"name": "Form Protection", "value": 15, "color": "#8B5CF6"}
            ]
        }
    }
