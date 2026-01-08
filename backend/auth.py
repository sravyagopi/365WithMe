import hashlib
import jwt
from datetime import datetime, timedelta
from config import settings
from typing import Optional

def hash_password(password: str) -> str:
    """Hash password using SHA-256"""
    return hashlib.sha256(password.encode()).hexdigest()

def verify_password(password: str, password_hash: str) -> bool:
    """Verify password against hash"""
    return hash_password(password) == password_hash

def create_access_token(user_id: int, username: str) -> str:
    """Create JWT access token"""
    expiration = datetime.utcnow() + timedelta(hours=settings.jwt_expiration_hours)
    payload = {
        'user_id': user_id,
        'username': username,
        'exp': expiration,
        'iat': datetime.utcnow()
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=settings.jwt_algorithm)

def decode_token(token: str) -> Optional[dict]:
    """Decode and verify JWT token"""
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=[settings.jwt_algorithm])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None
