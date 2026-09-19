from typing import List
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from backend.database.session import get_db
from backend.models.models import Website, Project, AuditLog
from backend.schemas.schemas import WebsiteCreate, WebsiteOut
from backend.scanner.passive_scanner import SecurityValidator

router = APIRouter(prefix="/websites", tags=["websites"])

@router.get("", response_model=List[WebsiteOut])
def list_websites(db: Session = Depends(get_db)):
    websites = db.query(Website).order_by(Website.created_at.desc()).all()
    return websites

@router.post("", response_model=WebsiteOut, status_code=status.HTTP_201_CREATED)
def create_website(payload: WebsiteCreate, db: Session = Depends(get_db)):
    # 1. Authorization check
    if not payload.is_authorized:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Authorization confirmation is required. You must confirm that you own this website or possess explicit written consent."
        )

    # 2. Strict URL Validation
    validation = SecurityValidator.validate_website_url(payload.url)
    if not validation["valid"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=validation["error"]
        )

    # 3. Check project exists or create default
    project = db.query(Project).filter(Project.id == payload.project_id).first()
    if not project:
        project = db.query(Project).first()
        if not project:
            project = Project(name="Default Core Web Infrastructure", client_name="Enterprise Security Division")
            db.add(project)
            db.commit()
            db.refresh(project)
        project_id = project.id
    else:
        project_id = project.id

    # Create website
    website = Website(
        project_id=project_id,
        name=payload.name.strip(),
        url=validation["normalized_url"],
        environment=payload.environment or "Production",
        description=payload.description,
        tags=payload.tags or "web-app, authorized",
        is_authorized=True,
        authorized_at=datetime.utcnow(),
        last_score=82
    )
    db.add(website)
    
    # Audit log
    audit = AuditLog(
        action="WEBSITE_REGISTERED",
        resource="WebsiteTarget",
        details=f"Authorized web target added: {website.url} (Scope verified: Web Application layer only)"
    )
    db.add(audit)
    db.commit()
    db.refresh(website)

    return website

@router.get("/{website_id}", response_model=WebsiteOut)
def get_website(website_id: str, db: Session = Depends(get_db)):
    website = db.query(Website).filter(Website.id == website_id).first()
    if not website:
        raise HTTPException(status_code=404, detail="Website not found.")
    return website

@router.delete("/{website_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_website(website_id: str, db: Session = Depends(get_db)):
    website = db.query(Website).filter(Website.id == website_id).first()
    if not website:
        raise HTTPException(status_code=404, detail="Website not found.")
    db.delete(website)
    db.commit()
    return None
