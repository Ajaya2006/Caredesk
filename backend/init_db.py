import sqlite3
import bcrypt
import os

def init_database():
    """Initialize the database with tables and admin user"""
    db_path = "caredesk.db"
    
    # Delete existing database if it exists
    if os.path.exists(db_path):
        os.remove(db_path)
        print("🗑️ Removed existing database")
    
    # Connect to SQLite (creates new file)
    conn = sqlite3.connect(db_path)
    cursor = conn.cursor()
    
    # Create users table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            user_id INTEGER PRIMARY KEY AUTOINCREMENT,
            username VARCHAR(100) UNIQUE NOT NULL,
            password_hash VARCHAR(255) NOT NULL,
            full_name VARCHAR(100) NOT NULL,
            role VARCHAR(20) NOT NULL,
            email VARCHAR(100) UNIQUE,
            phone VARCHAR(15),
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create doctors table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS doctors (
            doctor_id INTEGER PRIMARY KEY AUTOINCREMENT,
            doctor_name VARCHAR(100) NOT NULL,
            specialization VARCHAR(100) NOT NULL,
            phone VARCHAR(15),
            email VARCHAR(100) UNIQUE,
            experience INT,
            availability VARCHAR(50),
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create patients table with ALL required columns
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS patients (
            patient_id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_name VARCHAR(100) NOT NULL,
            phone VARCHAR(15),
            email VARCHAR(100),
            age INT,
            gender VARCHAR(10),
            address TEXT,
            visit_reason TEXT,
            is_active BOOLEAN DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    
    # Create appointments table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS appointments (
            appointment_id INTEGER PRIMARY KEY AUTOINCREMENT,
            patient_id INT NOT NULL,
            doctor_id INT NOT NULL,
            appointment_date DATE NOT NULL,
            appointment_time TIME NOT NULL,
            reason TEXT,
            status VARCHAR(20) DEFAULT 'Scheduled',
            remarks TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (patient_id) REFERENCES patients(patient_id) ON DELETE CASCADE,
            FOREIGN KEY (doctor_id) REFERENCES doctors(doctor_id) ON DELETE CASCADE
        )
    """)
    
    # Create indexes
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_patient_name ON patients(patient_name)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_doctor_name ON doctors(doctor_name)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_appointment_date ON appointments(appointment_date)")
    cursor.execute("CREATE INDEX IF NOT EXISTS idx_appointment_status ON appointments(status)")
    
    # Create admin user with bcrypt password hash
    password = "admin123"
    salt = bcrypt.gensalt()
    password_hash = bcrypt.hashpw(password.encode('utf-8'), salt).decode('utf-8')
    
    cursor.execute("""
        INSERT INTO users (username, password_hash, full_name, role, email, is_active)
        VALUES (?, ?, ?, ?, ?, ?)
    """, ("admin", password_hash, "System Admin", "admin", "admin@caredesk.com", 1))
    
    conn.commit()
    print("✅ Database initialized successfully!")
    print("   Tables created: users, doctors, patients, appointments")
    print("   Admin user created:")
    print("   Username: admin")
    print("   Password: admin123")
    
    conn.close()

if __name__ == "__main__":
    init_database()