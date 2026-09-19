from typing import Optional, List, Any, Dict
from datetime import datetime
from pydantic import BaseModel, HttpUrl, Field

class Token(BaseModel):
    access_token: str
    token_type: str
    user: Dict[str, Any]

class UserLogin(BaseModel):
    email: str
    password: str

class UserCreate(BaseModel):
    email: str
    password: str
    full_name: str
    role: Optional[str] = "analyst"

class UserOut(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    is_active: bool
    created_at: datetime
    class Config:
        from_attributes = True

class ProjectCreate(BaseModel):
    name: str
    description: Optional[str] = None
    client_name: Optional[str] = "Enterprise Security Division"

class ProjectOut(BaseModel):
    id: str
    name: str
    description: Optional[str]
    client_name: str
    created_at: datetime
    class Config:
        from_attributes = True

class WebsiteCreate(BaseModel):
    project_id: str
    name: str
    url: str
    environment: Optional[str] = "Production"
    description: Optional[str] = None
    tags: Optional[str] = "web-app, corporate"
    is_authorized: bool = Field(..., description="Must explicitly confirm authorization")

class WebsiteOut(BaseModel):
    id: str
    project_id: str
    name: str
    url: str
    environment: str
    description: Optional[str]
    tags: str
    is_authorized: bool
    authorized_at: Optional[datetime]
    last_score: int
    created_at: datetime
    class Config:
        from_attributes = True

class ScanCreate(BaseModel):
    project_id: Optional[str] = "default"
    website_id: Optional[str] = None
    target_url: Optional[str] = None
    profile_id: Optional[str] = None
    profile_name: Optional[str] = "Standard Web Assessment"
    max_pages: Optional[int] = 50
    max_depth: Optional[int] = 3
    check_forms: Optional[bool] = True
    check_cookies: Optional[bool] = True
    check_javascript: Optional[bool] = True
    check_headers: Optional[bool] = True
    capture_screenshots: Optional[bool] = True
    is_demo: Optional[bool] = False

class ScanOut(BaseModel):
    id: str
    project_id: str
    website_id: str
    profile_id: Optional[str] = None
    target_url: Optional[str] = None
    website_name: Optional[str] = None
    status: str
    progress: int
    current_stage: str
    current_url: str
    pages_analyzed: int
    findings_count: int
    security_score: int
    trigger_type: str
    started_at: Optional[datetime]
    completed_at: Optional[datetime]
    created_at: datetime
    class Config:
        from_attributes = True

class FindingOut(BaseModel):
    id: str
    scan_id: str
    website_id: str
    page_id: Optional[str]
    title: str
    severity: str
    category: str
    affected_url: str
    evidence: Optional[str]
    description: str
    impact: str
    remediation: str
    status: str
    cvss_score: float
    detected_at: datetime
    class Config:
        from_attributes = True

class PageOut(BaseModel):
    id: str
    scan_id: str
    website_id: str
    url: str
    path: str
    status_code: int
    title: str
    response_time_ms: int
    content_type: str
    forms_count: int
    links_count: int
    headers_count: int
    created_at: datetime
    class Config:
        from_attributes = True

class FormOut(BaseModel):
    id: str
    scan_id: str
    page_id: str
    action: str
    method: str
    has_csrf: bool
    password_inputs_count: int
    inputs_count: int
    form_html: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class CookieOut(BaseModel):
    id: str
    scan_id: str
    page_id: Optional[str]
    name: str
    domain: str
    path: str
    is_secure: bool
    is_httponly: bool
    same_site: str
    expires: Optional[str]
    risk_level: str
    created_at: datetime
    class Config:
        from_attributes = True

class SecurityHeaderOut(BaseModel):
    id: str
    scan_id: str
    page_id: Optional[str]
    header_name: str
    header_value: Optional[str]
    is_present: bool
    grade: str
    recommendation: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class TechnologyOut(BaseModel):
    id: str
    scan_id: str
    website_id: str
    name: str
    category: str
    version: Optional[str]
    confidence: int
    icon: str
    created_at: datetime
    class Config:
        from_attributes = True

class JavascriptFileOut(BaseModel):
    id: str
    scan_id: str
    page_id: Optional[str]
    url: str
    filename: str
    size_bytes: int
    has_sensitive_patterns: bool
    library_name: Optional[str]
    library_version: Optional[str]
    is_outdated: bool
    created_at: datetime
    class Config:
        from_attributes = True

class ScreenshotOut(BaseModel):
    id: str
    scan_id: str
    page_id: Optional[str]
    url: str
    viewport: str
    image_path: str
    created_at: datetime
    class Config:
        from_attributes = True

class AiAnalysisOut(BaseModel):
    id: str
    scan_id: str
    executive_summary: str
    risk_score: int
    risk_level: str
    key_observations: List[Any]
    remediation_roadmap: List[Any]
    recurring_issues: List[Any]
    security_trends: List[Any]
    created_at: datetime
    class Config:
        from_attributes = True

class ReportOut(BaseModel):
    id: str
    scan_id: str
    project_id: str
    title: str
    report_type: str
    format: str
    file_path: Optional[str]
    security_score: int
    summary_json: Dict[str, Any]
    created_at: datetime
    class Config:
        from_attributes = True

class NotificationOut(BaseModel):
    id: str
    title: str
    message: str
    level: str
    is_read: bool
    link: str
    created_at: datetime
    class Config:
        from_attributes = True

class AuditLogOut(BaseModel):
    id: str
    user_email: str
    action: str
    resource: str
    details: Optional[str]
    ip_address: str
    timestamp: datetime
    class Config:
        from_attributes = True
