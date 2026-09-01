from sqlalchemy.orm import Session
from sqlalchemy import or_
from ..models.user import User
from ..core.security import verify_password, create_access_token

class AuthService:
    def __init__(self, db: Session):
        self.db = db

    def authenticate(self, username_or_email: str, password: str):
        try:
            print(f"🔐 Attempting to authenticate: {username_or_email}")
            
            # Query user by username or email
            user = self.db.query(User).filter(
                or_(
                    User.username == username_or_email,
                    User.email == username_or_email,
                )
            ).first()
            
            if not user:
                print(f"❌ User not found: {username_or_email}")
                return None
            
            print(f"✅ User found: {user.username}")
            print(f"   Email: {user.email}")
            print(f"   Password hash length: {len(user.password_hash) if user.password_hash else 0}")
            
            # Verify password
            if not user.password_hash:
                print("❌ User has no password hash!")
                return None
                
            if not verify_password(password, user.password_hash):
                print(f"❌ Password verification failed for: {username_or_email}")
                return None
            
            print(f"✅ Password verified for: {username_or_email}")
            return user
            
        except Exception as e:
            print(f"❌ Authentication error: {e}")
            import traceback
            traceback.print_exc()
            return None

    def create_token(self, user_id):
        try:
            return create_access_token(data={"sub": user_id})
        except Exception as e:
            print(f"❌ Token creation error: {e}")
            import traceback
            traceback.print_exc()
            return None