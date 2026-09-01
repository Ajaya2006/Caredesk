from app.core.database import SessionLocal
from app.models.user import User
from app.core.security import get_password_hash
import uuid

def create_test_user():
    db = SessionLocal()
    
    try:
        # Check if user exists
        existing = db.query(User).filter(User.username == "testuser").first()
        if existing:
            print(f"✅ User already exists: {existing.username}")
            db.close()
            return
        
        # Create test user
        password = "test123"
        hashed = get_password_hash(password)
        
        user = User(
            user_id=uuid.uuid4(),
            username="testuser",
            password_hash=hashed,
            full_name="Test User",
            role="admin",
            email="test@caredesk.com",
            is_active=True
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        print(f"✅ Test user created!")
        print(f"   Username: testuser")
        print(f"   Password: test123")
        print(f"   Email: test@caredesk.com")
        print(f"   User ID: {user.user_id}")
        
    except Exception as e:
        print(f"❌ Error creating user: {e}")
        import traceback
        traceback.print_exc()
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    create_test_user()