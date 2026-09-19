import uuid
from datetime import datetime
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, Enum, JSON
)
from sqlalchemy.orm import relationship
from backend.database.session import Base

def generate_uuid():
    return str(uuid.uuid4())

class User(Base):
    __tablename__ = "users"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="analyst") # admin, analyst, viewer
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Role(Base):
    __tablename__ = "roles"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(50), unique=True, nullable=False)
    description = Column(String(255))
    permissions = Column(JSON, default=list)

class Permission(Base):
    __tablename__ = "permissions"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    code = Column(String(100), unique=True, nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(50), default="general")

class Project(Base):
    __tablename__ = "projects"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    client_name = Column(String(255), default="Enterprise Security Division")
    created_at = Column(DateTime, default=datetime.utcnow)
    
    websites = relationship("Website", back_populates="project", cascade="all, delete-orphan")
    scans = relationship("Scan", back_populates="project", cascade="all, delete-orphan")

class Website(Base):
    __tablename__ = "websites"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    name = Column(String(255), nullable=False)
    url = Column(String(500), nullable=False)
    environment = Column(String(50), default="Production") # Production, Staging, QA, Development
    description = Column(Text, nullable=True)
    tags = Column(String(255), default="web-app, corporate")
    is_authorized = Column(Boolean, default=False)
    authorized_at = Column(DateTime, nullable=True)
    last_score = Column(Integer, default=82)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    project = relationship("Project", back_populates="websites")
    scans = relationship("Scan", back_populates="website", cascade="all, delete-orphan")

class ScanProfile(Base):
    __tablename__ = "scan_profiles"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    name = Column(String(255), nullable=False)
    code = Column(String(100), unique=True, nullable=False)
    description = Column(Text)
    max_pages = Column(Integer, default=50)
    max_depth = Column(Integer, default=3)
    check_forms = Column(Boolean, default=True)
    check_cookies = Column(Boolean, default=True)
    check_javascript = Column(Boolean, default=True)
    check_headers = Column(Boolean, default=True)
    capture_screenshots = Column(Boolean, default=True)
    is_default = Column(Boolean, default=False)

class Scan(Base):
    __tablename__ = "scans"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    website_id = Column(String(36), ForeignKey("websites.id"), nullable=False)
    profile_id = Column(String(36), ForeignKey("scan_profiles.id"), nullable=True)
    status = Column(String(50), default="pending") # pending, running, completed, failed, cancelled
    progress = Column(Integer, default=0)
    current_stage = Column(String(100), default="Website Connection")
    current_url = Column(String(500), default="")
    pages_analyzed = Column(Integer, default=0)
    findings_count = Column(Integer, default=0)
    security_score = Column(Integer, default=82)
    trigger_type = Column(String(50), default="manual") # manual, scheduled, api
    started_at = Column(DateTime, nullable=True)
    completed_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    project = relationship("Project", back_populates="scans")
    website = relationship("Website", back_populates="scans")
    jobs = relationship("ScanJob", back_populates="scan", cascade="all, delete-orphan")
    pages = relationship("Page", back_populates="scan", cascade="all, delete-orphan")
    findings = relationship("Finding", back_populates="scan", cascade="all, delete-orphan")

class ScanJob(Base):
    __tablename__ = "scan_jobs"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    stage = Column(String(100), nullable=False)
    status = Column(String(50), default="pending") # pending, active, completed, failed
    details = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    scan = relationship("Scan", back_populates="jobs")

class Page(Base):
    __tablename__ = "pages"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    website_id = Column(String(36), ForeignKey("websites.id"), nullable=False)
    url = Column(String(500), nullable=False)
    path = Column(String(255), nullable=False)
    status_code = Column(Integer, default=200)
    title = Column(String(255), default="Untitled Web Document")
    response_time_ms = Column(Integer, default=120)
    content_type = Column(String(100), default="text/html; charset=utf-8")
    forms_count = Column(Integer, default=0)
    links_count = Column(Integer, default=0)
    headers_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="pages")
    forms = relationship("Form", back_populates="page", cascade="all, delete-orphan")
    cookies = relationship("Cookie", back_populates="page", cascade="all, delete-orphan")
    headers = relationship("SecurityHeader", back_populates="page", cascade="all, delete-orphan")

class Form(Base):
    __tablename__ = "forms"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    page_id = Column(String(36), ForeignKey("pages.id"), nullable=False)
    action = Column(String(500), default="")
    method = Column(String(20), default="POST")
    has_csrf = Column(Boolean, default=False)
    password_inputs_count = Column(Integer, default=0)
    inputs_count = Column(Integer, default=1)
    form_html = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    page = relationship("Page", back_populates="forms")
    fields = relationship("FormField", back_populates="form", cascade="all, delete-orphan")

class FormField(Base):
    __tablename__ = "form_fields"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    form_id = Column(String(36), ForeignKey("forms.id"), nullable=False)
    name = Column(String(100), default="")
    input_type = Column(String(50), default="text")
    is_required = Column(Boolean, default=False)
    autocomplete_val = Column(String(50), nullable=True)

    form = relationship("Form", back_populates="fields")

class JavascriptFile(Base):
    __tablename__ = "javascript_files"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    page_id = Column(String(36), ForeignKey("pages.id"), nullable=True)
    url = Column(String(500), nullable=False)
    filename = Column(String(255), default="")
    size_bytes = Column(Integer, default=0)
    has_sensitive_patterns = Column(Boolean, default=False)
    library_name = Column(String(100), nullable=True)
    library_version = Column(String(50), nullable=True)
    is_outdated = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

class Cookie(Base):
    __tablename__ = "cookies"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    page_id = Column(String(36), ForeignKey("pages.id"), nullable=True)
    name = Column(String(255), nullable=False)
    domain = Column(String(255), default="")
    path = Column(String(255), default="/")
    is_secure = Column(Boolean, default=False)
    is_httponly = Column(Boolean, default=False)
    same_site = Column(String(50), default="None") # Strict, Lax, None
    expires = Column(String(100), nullable=True)
    risk_level = Column(String(50), default="Low") # High, Medium, Low, Secure
    created_at = Column(DateTime, default=datetime.utcnow)

    page = relationship("Page", back_populates="cookies")

class SecurityHeader(Base):
    __tablename__ = "security_headers"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    page_id = Column(String(36), ForeignKey("pages.id"), nullable=True)
    header_name = Column(String(100), nullable=False)
    header_value = Column(Text, nullable=True)
    is_present = Column(Boolean, default=False)
    grade = Column(String(10), default="F") # A+, A, B, C, F
    recommendation = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    page = relationship("Page", back_populates="headers")

class Technology(Base):
    __tablename__ = "technologies"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    website_id = Column(String(36), ForeignKey("websites.id"), nullable=False)
    name = Column(String(100), nullable=False)
    category = Column(String(100), default="Web Framework") # CMS, JS Library, Web Server, CDN, UI Framework
    version = Column(String(50), nullable=True)
    confidence = Column(Integer, default=95)
    icon = Column(String(100), default="code")
    created_at = Column(DateTime, default=datetime.utcnow)

class Screenshot(Base):
    __tablename__ = "screenshots"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    page_id = Column(String(36), ForeignKey("pages.id"), nullable=True)
    url = Column(String(500), nullable=False)
    viewport = Column(String(50), default="1440x900 Desktop")
    image_path = Column(String(500), default="/assets/screenshots/preview.webp")
    created_at = Column(DateTime, default=datetime.utcnow)

class Finding(Base):
    __tablename__ = "findings"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    website_id = Column(String(36), ForeignKey("websites.id"), nullable=False)
    page_id = Column(String(36), ForeignKey("pages.id"), nullable=True)
    title = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False) # Critical, High, Medium, Low, Informational
    category = Column(String(100), default="Application Security")
    affected_url = Column(String(500), nullable=False)
    evidence = Column(Text, nullable=True)
    description = Column(Text, nullable=False)
    impact = Column(Text, nullable=False)
    remediation = Column(Text, nullable=False)
    status = Column(String(50), default="Open") # Open, Confirmed, False Positive, Accepted Risk, Resolved
    cvss_score = Column(Float, default=5.0)
    detected_at = Column(DateTime, default=datetime.utcnow)

    scan = relationship("Scan", back_populates="findings")

class Vulnerability(Base):
    __tablename__ = "vulnerabilities"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=True)
    title = Column(String(255), nullable=False)
    severity = Column(String(50), nullable=False)
    cwe_id = Column(String(50), default="CWE-693")
    owasp_category = Column(String(100), default="A05:2021-Security Misconfiguration")
    remediation_guide = Column(Text, nullable=True)
    reference_urls = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

class AiAnalysis(Base):
    __tablename__ = "ai_analysis"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), unique=True, nullable=False)
    executive_summary = Column(Text, nullable=False)
    risk_score = Column(Integer, default=78)
    risk_level = Column(String(50), default="Elevated")
    key_observations = Column(JSON, default=list)
    remediation_roadmap = Column(JSON, default=list)
    recurring_issues = Column(JSON, default=list)
    security_trends = Column(JSON, default=list)
    created_at = Column(DateTime, default=datetime.utcnow)

class Report(Base):
    __tablename__ = "reports"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    scan_id = Column(String(36), ForeignKey("scans.id"), nullable=False)
    project_id = Column(String(36), ForeignKey("projects.id"), nullable=False)
    title = Column(String(255), nullable=False)
    report_type = Column(String(100), default="Technical Web Security Report") # Executive Report, Technical Web Security Report, Vulnerability Report, Website Security Summary
    format = Column(String(20), default="HTML") # PDF, HTML, JSON
    file_path = Column(String(500), nullable=True)
    security_score = Column(Integer, default=82)
    summary_json = Column(JSON, default=dict)
    created_at = Column(DateTime, default=datetime.utcnow)

class Notification(Base):
    __tablename__ = "notifications"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_id = Column(String(36), nullable=True)
    title = Column(String(255), nullable=False)
    message = Column(Text, nullable=False)
    level = Column(String(50), default="info") # info, warning, critical, success
    is_read = Column(Boolean, default=False)
    link = Column(String(255), default="/dashboard")
    created_at = Column(DateTime, default=datetime.utcnow)

class ScheduledScan(Base):
    __tablename__ = "scheduled_scans"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    website_id = Column(String(36), ForeignKey("websites.id"), nullable=False)
    profile_id = Column(String(36), ForeignKey("scan_profiles.id"), nullable=True)
    frequency = Column(String(50), default="Weekly") # Daily, Weekly, Monthly
    cron_expr = Column(String(50), default="0 0 * * 0")
    next_run = Column(DateTime, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    user_email = Column(String(255), default="analyst@securerecon.io")
    action = Column(String(100), nullable=False)
    resource = Column(String(100), nullable=False)
    details = Column(Text, nullable=True)
    ip_address = Column(String(50), default="127.0.0.1")
    timestamp = Column(DateTime, default=datetime.utcnow)

class Setting(Base):
    __tablename__ = "settings"
    id = Column(String(36), primary_key=True, default=generate_uuid)
    key = Column(String(100), unique=True, nullable=False)
    value = Column(Text, nullable=False)
    description = Column(String(255), nullable=True)
    updated_at = Column(DateTime, default=datetime.utcnow)
