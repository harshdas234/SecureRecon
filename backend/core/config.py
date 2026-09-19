import os
from typing import List

class Settings:
    PROJECT_NAME: str = "SecureRecon"
    VERSION: str = "1.0.0"
    TAGLINE: str = "Web Application Security, Simplified."
    API_V1_STR: str = "/api"
    
    # Dual database support: defaults to SQLite for instant local execution, supports PostgreSQL
    # If running in serverless (e.g. Vercel), fall back to /tmp if no external DB provided
    _default_db = "sqlite:////tmp/securerecon.db" if os.getenv("VERCEL") else "sqlite:///./securerecon.db"
    DATABASE_URL: str = os.getenv("DATABASE_URL", _default_db)
    
    SECRET_KEY: str = os.getenv("SECRET_KEY", "securerecon_super_secret_cybersecurity_key_2026")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 24 hours
    
    ALLOWED_ORIGINS: List[str] = os.getenv("ALLOWED_ORIGINS", "").split(",") if os.getenv("ALLOWED_ORIGINS") else [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "https://*.vercel.app",
        "*"
    ]

settings = Settings()
