from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services.auth_service import AuthService
from ...schemas.auth import Token, UserCreate, UserOut
from ...core.security import get_current_user, get_password_hash
from ...models.user import User
from pydantic import BaseModel
import uuid
import json
import urllib.request
import urllib.error

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    auth_service = AuthService(db)
    user = auth_service.authenticate(form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = auth_service.create_token(user.user_id)
    return {"access_token": access_token, "token_type": "bearer"}

class GoogleLoginRequest(BaseModel):
    access_token: str

def get_google_user_info(access_token: str):
    try:
        request = urllib.request.Request(
            "https://www.googleapis.com/oauth2/v3/userinfo",
            headers={"Authorization": f"Bearer {access_token}"},
        )
        with urllib.request.urlopen(request, timeout=10) as response:
            return json.load(response)
    except urllib.error.HTTPError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid Google access token",
        )
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to verify Google access token",
        )

@router.post("/google", response_model=Token)
def google_login(data: GoogleLoginRequest, db: Session = Depends(get_db)):
    google_user = get_google_user_info(data.access_token)
    email = google_user.get("email")
    if not email:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Google account email is required",
        )

    full_name = google_user.get("name") or email.split("@")[0]
    user = db.query(User).filter(User.email == email).first()

    if not user:
        username_base = email.split("@")[0]
        username = username_base
        while db.query(User).filter(User.username == username).first():
            username = f"{username_base}_{uuid.uuid4().hex[:8]}"

        user = User(
            username=username,
            password_hash=get_password_hash(str(uuid.uuid4())),
            full_name=full_name,
            email=email,
            role="admin",  # default role for new users
            is_active=True,
        )
        db.add(user)
        db.commit()
        db.refresh(user)

    auth_service = AuthService(db)
    access_token = auth_service.create_token(user.user_id)
    return {"access_token": access_token, "token_type": "bearer"}

# New signup endpoint
class UserCreateSchema(BaseModel):
    name: str
    email: str
    password: str

@router.post("/register", response_model=Token)
def register(user_data: UserCreateSchema, db: Session = Depends(get_db)):
    # Check if user exists
    existing = db.query(User).filter(
        (User.username == user_data.email) | (User.email == user_data.email)
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user with email as username (or use name)
    hashed = get_password_hash(user_data.password)
    new_user = User(
        user_id=uuid.uuid4(),
        username=user_data.email,  # using email as username
        password_hash=hashed,
        full_name=user_data.name,
        email=user_data.email,
        role="admin",
        is_active=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    # Return token
    auth_service = AuthService(db)
    access_token = auth_service.create_token(new_user.user_id)
    return {"access_token": access_token, "token_type": "bearer"}

@router.get("/me")
def get_me(current_user: User = Depends(get_current_user)):
    return {
        "user_id": str(current_user.user_id),
        "full_name": current_user.full_name,
        "username": current_user.username,
        "email": current_user.email,
        "role": current_user.role,
        "is_active": current_user.is_active
    }