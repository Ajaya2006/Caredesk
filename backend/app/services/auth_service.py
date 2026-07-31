from sqlalchemy.orm import Session
from ..models.user import User
from ..core.security import verify_password, create_access_token

class AuthService:
    def __init__(self, db: Session):
        self.db = db
    
    def authenticate(self, username_or_email: str, password: str):
        # Check if input is email or username
        user = self.db.query(User).filter(
            (User.username == username_or_email) | (User.email == username_or_email)
        ).first()
        
        if not user or not verify_password(password, user.password_hash):
            return None
        return user
    
    def create_token(self, user_id):
        return create_access_token(data={"sub": str(user_id)})