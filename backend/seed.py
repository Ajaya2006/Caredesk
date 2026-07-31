from app.core.database import engine, Base
from app.models.user import User
from app.models.doctor import Doctor
from app.models.patient import Patient
from app.models.appointment import Appointment
from app.core.database import SessionLocal
import bcrypt
import uuid

def reset_and_seed():
    print("🗑️ Dropping all tables...")
    Base.metadata.drop_all(bind=engine)
    print("✅ Tables dropped!")
    
    print("🔨 Creating tables...")
    Base.metadata.create_all(bind=engine)
    print("✅ Tables created!")
    
    db = SessionLocal()
    
    try:
        # Check if admin exists
        admin = db.query(User).filter(User.username == "admin").first()
        if not admin:
            print("👤 Creating admin user...")
            password = "admin123"
            salt = bcrypt.gensalt()
            password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
            
            admin = User(
                user_id=uuid.uuid4(),
                username="admin",
                password_hash=password_hash,
                full_name="System Admin",
                role="admin",
                email="admin@caredesk.com",
                is_active=True
            )
            db.add(admin)
            db.commit()
            print("✅ Admin user created successfully!")
            print("   Username: admin")
            print("   Password: admin123")
        else:
            print("ℹ️ Admin user already exists")
        
        # Create sample doctor
        doctor = db.query(Doctor).first()
        if not doctor:
            print("👨‍⚕️ Creating sample doctor...")
            doctor = Doctor(
                doctor_id=uuid.uuid4(),
                doctor_name="Dr. Sarah Johnson",
                specialization="Cardiology",
                phone="9876543210",
                email="sarah.johnson@clinic.com",
                experience=10,
                availability="Mon-Fri 9:00-17:00",
                is_active=True
            )
            db.add(doctor)
            db.commit()
            print("✅ Sample doctor created!")
        
        # Create sample patient
        patient = db.query(Patient).first()
        if not patient:
            print("👤 Creating sample patient...")
            patient = Patient(
                patient_id=uuid.uuid4(),
                patient_name="John Doe",
                phone="9876543210",
                email="john.doe@email.com",
                age=30,
                gender="Male",
                address="123 Main St",
                visit_reason="Regular Checkup",
                is_active=True
            )
            db.add(patient)
            db.commit()
            print("✅ Sample patient created!")
        
        print("🎉 Seed completed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_and_seed()