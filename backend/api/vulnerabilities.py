from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session

from backend.database.session import get_db
from backend.models.models import Finding, Vulnerability, AuditLog
from backend.schemas.schemas import FindingOut

router = APIRouter(prefix="", tags=["vulnerabilities"])

class StatusUpdate(BaseModel):
    status: str

@router.get("/findings", response_model=List[FindingOut])
def get_findings(
    scan_id: Optional[str] = Query(None),
    severity: Optional[str] = Query(None),
    status_filter: Optional[str] = Query(None, alias="status"),
    db: Session = Depends(get_db)
):
    query = db.query(Finding)
    if scan_id:
        query = query.filter(Finding.scan_id == scan_id)
    if severity and severity != "All":
        query = query.filter(Finding.severity == severity)
    if status_filter and status_filter != "All":
        query = query.filter(Finding.status == status_filter)
    return query.order_by(Finding.detected_at.desc()).all()

@router.get("/findings/{finding_id}", response_model=FindingOut)
def get_finding_by_id(finding_id: str, db: Session = Depends(get_db)):
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found.")
    return finding

@router.patch("/findings/{finding_id}/status", response_model=FindingOut)
def update_finding_status(finding_id: str, payload: StatusUpdate, db: Session = Depends(get_db)):
    valid_statuses = ["Open", "Confirmed", "False Positive", "Accepted Risk", "Resolved"]
    if payload.status not in valid_statuses:
        raise HTTPException(status_code=400, detail=f"Status must be one of {valid_statuses}")
    
    finding = db.query(Finding).filter(Finding.id == finding_id).first()
    if not finding:
        raise HTTPException(status_code=404, detail="Finding not found.")
    
    old_status = finding.status
    finding.status = payload.status

    audit = AuditLog(
        action="FINDING_STATUS_CHANGED",
        resource="Finding",
        details=f"Finding '{finding.title}' status shifted from {old_status} to {payload.status}."
    )
    db.add(audit)
    db.commit()
    db.refresh(finding)
    return finding

@router.get("/vulnerabilities", response_model=List[FindingOut])
def list_vulnerabilities(db: Session = Depends(get_db)):
    # Maps directly to findings for vulnerability view
    return db.query(Finding).order_by(Finding.detected_at.desc()).all()
