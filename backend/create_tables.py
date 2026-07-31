from app.core.database import engine, Base
from app.models.user import User
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import Appointment

def create_tables():
    print("🔨 Creating tables...")
    try:
        Base.metadata.create_all(bind=engine)
        print("✅ Tables created successfully!")
        print("   - users")
        print("   - doctors")
        print("   - patients")
        print("   - appointments")
    except Exception as e:
        print(f"❌ Error creating tables: {e}")

if __name__ == "__main__":
    create_tables()