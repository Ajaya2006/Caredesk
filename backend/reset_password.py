import bcrypt
from app.database import SessionLocal
from app.models import User

def reset_password():
    db = SessionLocal()
    user = db.query(User).filter(User.email == "admin@caredesk.com").first()
    if user:
        # Generate new password hash
        salt = bcrypt.gensalt()
        new_hash = bcrypt.hashpw("admin123".encode('utf-8'), salt).decode('utf-8')
        user.password_hash = new_hash
        db.commit()
        print("✅ Password reset to: admin123")
        print(f"New hash: {new_hash[:50]}...")
    else:
        print("❌ User not found. Run seed.py first.")
    db.close()

if __name__ == "__main__":
    reset_password()