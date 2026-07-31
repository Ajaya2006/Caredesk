from app.core.database import engine, Base
from app.models.user import User
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import Appointment

def reset_database():
    print("🗑️ Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("✅ All tables dropped!")
    
    print("🔨 Creating tables with UUID...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created successfully with UUID primary keys!")

if __name__ == "__main__":
    reset_database()