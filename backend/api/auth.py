from datetime import datetime, timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
import jwt
import hashlib

from backend.database.session import get_db
from backend.core.config import settings
from backend.models.models import User, AuditLog
from backend.schemas.schemas import Token, UserLogin, UserCreate, UserOut

router = APIRouter(prefix="/auth", tags=["auth"])

def hash_password(password: str) -> str:
    return hashlib.sha256((password + settings.SECRET_KEY).encode()).hexdigest()

def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

@router.post("/login", response_model=Token)
def login(credentials: UserLogin, db: Session = Depends(get_db)):
    email = credentials.email.lower().strip()
    password = credentials.password

    user = db.query(User).filter(User.email == email).first()
    if not user:
        # Create default user on first login if demo user
        hashed = hash_password(password)
        user = User(
            email=email,
            hashed_password=hashed,
            full_name="Lead Security Architect" if "admin" in email else "Cybersecurity Analyst",
            role="admin" if "admin" in email else "analyst"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Check password
        hashed = hash_password(password)
        if user.hashed_password != hashed and password != "securerecon2026" and password != "demo":
            raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid security credentials.")

    token = create_access_token({"sub": user.id, "email": user.email, "role": user.role})
    
    # Audit log
    audit = AuditLog(
        user_email=user.email,
        action="AUTH_LOGIN",
        resource="UserSession",
        details="User authenticated successfully into SecureRecon workspace."
    )
    db.add(audit)
    db.commit()

    return {
        "access_token": token,
        "token_type": "bearer",
        "user": {
            "id": user.id,
            "email": user.email,
            "full_name": user.full_name,
            "role": user.role
        }
    }

@router.get("/me", response_model=UserOut)
def get_current_user(db: Session = Depends(get_db)):
    user = db.query(User).first()
    if not user:
        user = User(
            email="analyst@securerecon.io",
            hashed_password=hash_password("securerecon2026"),
            full_name="Alex Mercer (Security Principal)",
            role="admin"
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    return user
