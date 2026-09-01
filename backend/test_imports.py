print("Testing imports...")

try:
    from app.core.security import verify_password, get_password_hash, create_access_token
    print("✅ All security functions imported successfully")
except ImportError as e:
    print(f"❌ Import error: {e}")
    
try:
    from app.services.auth_service import AuthService
    print("✅ AuthService imported successfully")
except ImportError as e:
    print(f"❌ Import error: {e}")
    
try:
    from app.api.v1.auth import router
    print("✅ Auth router imported successfully")
except ImportError as e:
    print(f"❌ Import error: {e}")
    
print("Done!")