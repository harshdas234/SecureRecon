from typing import List, Optional
from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from backend.database.session import get_db
from backend.models.models import (
    Page, Form, JavascriptFile, Cookie, SecurityHeader, Technology, Screenshot
)
from backend.schemas.schemas import (
    PageOut, FormOut, JavascriptFileOut, CookieOut, SecurityHeaderOut, TechnologyOut, ScreenshotOut
)

router = APIRouter(prefix="", tags=["analysis"])

@router.get("/pages", response_model=List[PageOut])
def get_pages(scan_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Page)
    if scan_id:
        query = query.filter(Page.scan_id == scan_id)
    return query.order_by(Page.created_at.desc()).all()

@router.get("/forms", response_model=List[FormOut])
def get_forms(scan_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Form)
    if scan_id:
        query = query.filter(Form.scan_id == scan_id)
    return query.order_by(Form.created_at.desc()).all()

@router.get("/javascript", response_model=List[JavascriptFileOut])
def get_javascript(scan_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(JavascriptFile)
    if scan_id:
        query = query.filter(JavascriptFile.scan_id == scan_id)
    return query.order_by(JavascriptFile.created_at.desc()).all()

@router.get("/cookies", response_model=List[CookieOut])
def get_cookies(scan_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Cookie)
    if scan_id:
        query = query.filter(Cookie.scan_id == scan_id)
    return query.order_by(Cookie.created_at.desc()).all()

@router.get("/security-headers", response_model=List[SecurityHeaderOut])
def get_security_headers(scan_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(SecurityHeader)
    if scan_id:
        query = query.filter(SecurityHeader.scan_id == scan_id)
    return query.order_by(SecurityHeader.created_at.desc()).all()

@router.get("/technologies", response_model=List[TechnologyOut])
def get_technologies(scan_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Technology)
    if scan_id:
        query = query.filter(Technology.scan_id == scan_id)
    return query.order_by(Technology.created_at.desc()).all()

@router.get("/screenshots", response_model=List[ScreenshotOut])
def get_screenshots(scan_id: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(Screenshot)
    if scan_id:
        query = query.filter(Screenshot.scan_id == scan_id)
    return query.order_by(Screenshot.created_at.desc()).all()
