from app.core.database import engine
from sqlalchemy import text

def add_missing_columns():
    with engine.connect() as conn:
        # Add updated_at to users
        try:
            conn.execute(text("ALTER TABLE users ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"))
            conn.commit()
            print("✅ Added updated_at to users")
        except Exception as e:
            print(f"⚠️ users: {e}")
        
        # Add updated_at to doctors
        try:
            conn.execute(text("ALTER TABLE doctors ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"))
            conn.commit()
            print("✅ Added updated_at to doctors")
        except Exception as e:
            print(f"⚠️ doctors: {e}")
        
        # Add updated_at to patients
        try:
            conn.execute(text("ALTER TABLE patients ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"))
            conn.commit()
            print("✅ Added updated_at to patients")
        except Exception as e:
            print(f"⚠️ patients: {e}")
        
        # Add updated_at to appointments
        try:
            conn.execute(text("ALTER TABLE appointments ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP"))
            conn.commit()
            print("✅ Added updated_at to appointments")
        except Exception as e:
            print(f"⚠️ appointments: {e}")

if __name__ == "__main__":
    add_missing_columns()