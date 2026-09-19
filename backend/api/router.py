from fastapi import APIRouter
from backend.api import auth, dashboard, websites, scans, analysis, vulnerabilities, ai_analysis, reports, operations

api_router = APIRouter()

api_router.include_router(auth.router)
api_router.include_router(dashboard.router)
api_router.include_router(websites.router)
api_router.include_router(scans.router)
api_router.include_router(analysis.router)
api_router.include_router(vulnerabilities.router)
api_router.include_router(ai_analysis.router)
api_router.include_router(reports.router)
api_router.include_router(operations.router)
