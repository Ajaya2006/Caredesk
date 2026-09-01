# backend/app/core/security.py - ADD THIS FUNCTION

from datetime import datetime, timedelta
from typing import Optional
import uuid
import bcrypt
from jose import JWTError, jwt
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session

from ..core.database import get_db
from ..models.user import User
from .config import settings

oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl=f"{settings.API_V1_STR}/auth/login"
)

# Password Functions
def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify plain password against hashed password"""
    try:
        print(f"🔐 Verifying password...")
        print(f"   Plain password length: {len(plain_password)}")
        print(f"   Hashed password length: {len(hashed_password) if hashed_password else 0}")
        
        if not plain_password or not hashed_password:
            print("❌ Missing password or hash")
            return False
            
        if isinstance(plain_password, str):
            plain_bytes = plain_password.encode('utf-8')
        else:
            plain_bytes = plain_password
            
        if isinstance(hashed_password, str):
            hash_bytes = hashed_password.encode('utf-8')
        else:
            hash_bytes = hashed_password
            
        result = bcrypt.checkpw(plain_bytes, hash_bytes)
        print(f"   Verification result: {result}")
        return result
        
    except ValueError as e:
        print(f"❌ Password verification ValueError: {e}")
        return False
    except Exception as e:
        print(f"❌ Password verification error: {e}")
        import traceback
        traceback.print_exc()
        return False

def get_password_hash(password: str) -> str:
    """Hash password using bcrypt"""
    try:
        salt = bcrypt.gensalt()
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')
    except Exception as e:
        print(f"❌ Password hashing error: {e}")
        import traceback
        traceback.print_exc()
        raise

# ✅ ADD THIS FUNCTION - JWT Token Creation
def create_access_token(
    data: dict,
    expires_delta: Optional[timedelta] = None,
) -> str:
    """Create JWT access token"""
    to_encode = data.copy()

    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(
            minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
        )

    # Convert UUID -> String before storing in JWT
    if "sub" in to_encode:
        to_encode["sub"] = str(to_encode["sub"])

    to_encode.update({"exp": expire})

    encoded_jwt = jwt.encode(
        to_encode,
        settings.SECRET_KEY,
        algorithm=settings.ALGORITHM,
    )

    return encoded_jwt

# Current User
async def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )

    try:
        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM],
        )
        
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
            
        # Convert string -> UUID
        user_id = uuid.UUID(user_id)
        
        user = db.query(User).filter(User.user_id == user_id).first()
        if user is None:
            raise credentials_exception
            
        return user
        
    except (JWTError, ValueError) as e:
        print(f"❌ JWT Decode Error: {e}")
        raise credentials_exception
    except Exception as e:
        print(f"❌ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        raise credentials_exception