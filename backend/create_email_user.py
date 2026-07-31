from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
import uuid

def create_email_user():
    db = SessionLocal()
    
    email = "sahoajayakas12345@gmail.com"
    
    # Check if user exists
    existing = db.query(User).filter(
        (User.username == email) | (User.email == email)
    ).first()
    
    if existing:
        print(f"ℹ️ User already exists: {existing.username}")
    else:
        # Create new user with email as username
        new_user = User(
            user_id=uuid.uuid4(),
            username=email,  # Use email as username
            password_hash=get_password_hash("admin123"),
            full_name="User",
            role="admin",
            email=email,
            is_active=True
        )
        db.add(new_user)
        db.commit()
        print(f"✅ User created with username: {email}")
        print(f"   Password: admin123")
    
    db.close()

if __name__ == "__main__":
    create_email_user()