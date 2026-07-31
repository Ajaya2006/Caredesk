import bcrypt
from app.core.database import SessionLocal
from app.models.user import User

def verify_admin_password():
    db = SessionLocal()
    
    try:
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            print("❌ Admin user not found!")
            return
        
        print(f"👤 Admin found: {admin.username}")
        print(f"📧 Email: {admin.email}")
        print(f"🔑 Password hash: {admin.password_hash[:50]}...")
        
        # Test password
        test_password = "admin123"
        try:
            if bcrypt.checkpw(test_password.encode('utf-8'), admin.password_hash.encode('utf-8')):
                print("✅ Password 'admin123' is CORRECT!")
            else:
                print("❌ Password 'admin123' is INCORRECT!")
                
                # Reset password
                print("🔄 Resetting password...")
                salt = bcrypt.gensalt()
                new_hash = bcrypt.hashpw(test_password.encode('utf-8'), salt).decode('utf-8')
                admin.password_hash = new_hash
                db.commit()
                print(f"✅ Password reset to: {test_password}")
                
        except Exception as e:
            print(f"❌ Error verifying password: {e}")
            
    except Exception as e:
        print(f"❌ Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    verify_admin_password()