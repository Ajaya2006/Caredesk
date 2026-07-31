-- Clinic Appointment & Patient Desk — SQLite Schema
-- Compatible with SQLite (no SERIAL, uses INTEGER PRIMARY KEY AUTOINCREMENT)

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    user_id         INTEGER PRIMARY KEY AUTOINCREMENT,
    username        VARCHAR(100) UNIQUE NOT NULL,
    password_hash   VARCHAR(255) NOT NULL,
    full_name       VARCHAR(100) NOT NULL,
    role            VARCHAR(20) NOT NULL,          -- admin | receptionist | doctor
    email           VARCHAR(100) UNIQUE,
    phone           VARCHAR(15),
    is_active       BOOLEAN DEFAULT 1,
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Doctors Table
CREATE TABLE IF NOT EXISTS doctors (
    doctor_id       INTEGER PRIMARY KEY AUTOINCREMENT,
    doctor_name     VARCHAR(100) NOT NULL,
    specialization  VARCHAR(100) NOT NULL,
    phone           VARCHAR(15),
    email           VARCHAR(100) UNIQUE,
    experience      INT,
    availability    VARCHAR(50),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Patients Table
CREATE TABLE IF NOT EXISTS patients (
    patient_id      INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_name    VARCHAR(100) NOT NULL,
    age             INT,
    gender          VARCHAR(10),
    phone           VARCHAR(15),
    email           VARCHAR(100),
    address         TEXT,
    blood_group     VARCHAR(5),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Appointments Table
CREATE TABLE IF NOT EXISTS appointments (
    appointment_id     INTEGER PRIMARY KEY AUTOINCREMENT,
    patient_id         INT NOT NULL REFERENCES patients(patient_id) ON DELETE CASCADE,
    doctor_id          INT NOT NULL REFERENCES doctors(doctor_id) ON DELETE CASCADE,
    appointment_date   DATE NOT NULL,
    appointment_time   TIME NOT NULL,
    reason             TEXT,
    status             VARCHAR(20) DEFAULT 'Scheduled',   -- Scheduled | Completed | Cancelled
    remarks            TEXT,
    created_at         TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS ix_patient_name       ON patients(patient_name);
CREATE INDEX IF NOT EXISTS ix_doctor_name        ON doctors(doctor_name);
CREATE INDEX IF NOT EXISTS ix_appointment_date   ON appointments(appointment_date);
CREATE INDEX IF NOT EXISTS ix_appointment_status ON appointments(status);

-- Insert default admin user (password: admin123)
-- Password hash is bcrypt of "admin123"
INSERT OR IGNORE INTO users (username, password_hash, full_name, role, email, is_active)
VALUES ('admin', '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5GyYvNqZ6VbCG', 'System Admin', 'admin', 'admin@caredesk.com', 1);