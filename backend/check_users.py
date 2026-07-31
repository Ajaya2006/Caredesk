from app.core.database import SessionLocal
from app.models.user import User

def check_users():
    db = SessionLocal()
    users = db.query(User).all()
    
    print(f"📋 Total users: {len(users)}")
    for user in users:
        print(f"   Username: {user.username}")
        print(f"   Email: {user.email}")
        print(f"   Full Name: {user.full_name}")
        print(f"   Role: {user.role}")
        print("   ---")
    
    db.close()

if __name__ == "__main__":
    check_users()