import asyncio
from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, BackgroundTasks, status
from sqlalchemy.orm import Session

from backend.database.session import get_db, SessionLocal
from backend.models.models import Scan, Website, Project, ScanProfile, AuditLog
from backend.schemas.schemas import ScanCreate, ScanOut
from backend.scanner.demo_simulator import ScanPipelineSimulator
from backend.api.websocket_manager import ws_manager

router = APIRouter(prefix="/scans", tags=["scans"])

def run_background_assessment(scan_id: str):
    db = SessionLocal()
    try:
        loop = asyncio.new_event_loop()
        asyncio.set_event_loop(loop)
        loop.run_until_complete(ScanPipelineSimulator.run_simulation(db, scan_id, ws_manager))
    finally:
        db.close()

from urllib.parse import urlparse
from backend.scanner.passive_scanner import SecurityValidator

@router.get("", response_model=List[ScanOut])
def list_scans(db: Session = Depends(get_db)):
    scans = db.query(Scan).order_by(Scan.created_at.desc()).all()
    for s in scans:
        if s.website:
            s.target_url = s.website.url
            s.website_name = s.website.name
    return scans

@router.post("", response_model=ScanOut, status_code=status.HTTP_201_CREATED)
def start_scan(payload: ScanCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    website = None

    # Option A: Direct target_url input (e.g. https://google.com)
    if payload.target_url:
        val = SecurityValidator.validate_website_url(payload.target_url)
        if not val["valid"]:
            raise HTTPException(status_code=400, detail=val["error"])
        norm_url = val["normalized_url"]
        website = db.query(Website).filter(Website.url == norm_url).first()
        if not website:
            project = db.query(Project).first()
            if not project:
                project = Project(name="Cybersecurity Operations Group", client_name="Enterprise Security Division")
                db.add(project)
                db.commit()
                db.refresh(project)
            parsed_host = urlparse(norm_url).netloc
            website = Website(
                project_id=project.id,
                name=f"{parsed_host} Target",
                url=norm_url,
                environment="Production",
                description=f"Authorized web application assessment target ({parsed_host}).",
                tags="web-app, authorized, custom",
                is_authorized=True,
                authorized_at=datetime.utcnow(),
                last_score=85
            )
            db.add(website)
            db.commit()
            db.refresh(website)

    # Option B: Selected existing website_id
    elif payload.website_id:
        website = db.query(Website).filter(Website.id == payload.website_id).first()

    # Option C: Fallback to first verified website
    if not website:
        website = db.query(Website).first()

    if not website:
        raise HTTPException(status_code=404, detail="No authorized target website found. Please provide a valid target URL.")

    project = db.query(Project).filter(Project.id == payload.project_id).first() if payload.project_id else None
    if not project:
        project = website.project or db.query(Project).first()

    # Create scan record
    scan = Scan(
        project_id=project.id,
        website_id=website.id,
        status="running",
        progress=5,
        current_stage="Website Connection",
        current_url=website.url,
        pages_analyzed=0,
        findings_count=0,
        security_score=website.last_score or 85,
        started_at=datetime.utcnow()
    )
    db.add(scan)
    db.commit()
    db.refresh(scan)

    scan.target_url = website.url
    scan.website_name = website.name

    # Audit log
    audit = AuditLog(
        action="SCAN_INITIATED",
        resource="WebAssessment",
        details=f"SecureRecon assessment started for {website.url} (Profile: {payload.profile_name})"
    )
    db.add(audit)
    db.commit()

    # Trigger async pipeline task
    background_tasks.add_task(run_background_assessment, scan.id)

    return scan

@router.get("/{scan_id}", response_model=ScanOut)
def get_scan(scan_id: str, db: Session = Depends(get_db)):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")
    if scan.website:
        scan.target_url = scan.website.url
        scan.website_name = scan.website.name
    return scan

@router.post("/{scan_id}/cancel", response_model=ScanOut)
def cancel_scan(scan_id: str, db: Session = Depends(get_db)):
    scan = db.query(Scan).filter(Scan.id == scan_id).first()
    if not scan:
        raise HTTPException(status_code=404, detail="Scan not found.")
    scan.status = "cancelled"
    db.commit()
    db.refresh(scan)
    return scan
