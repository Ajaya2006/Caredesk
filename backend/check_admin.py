import psycopg2
import os
from dotenv import load_dotenv

load_dotenv()

def check_admin():
    try:
        # Get database URL from environment
        DATABASE_URL = os.getenv("DATABASE_URL")
        
        # Connect to PostgreSQL
        conn = psycopg2.connect(DATABASE_URL)
        cursor = conn.cursor()
        
        # Check if admin user exists
        cursor.execute("SELECT user_id, username, email, full_name FROM users WHERE username = 'admin'")
        admin = cursor.fetchone()
        
        if admin:
            print(f"✅ Admin user found!")
            print(f"   ID: {admin[0]}")
            print(f"   Username: {admin[1]}")
            print(f"   Email: {admin[2]}")
            print(f"   Full Name: {admin[3]}")
        else:
            print("❌ Admin user NOT found!")
            print("   Please run: python seed.py")
        
        # List all users
        cursor.execute("SELECT username, email FROM users")
        users = cursor.fetchall()
        print(f"\n📋 All users in database: {len(users)}")
        for user in users:
            print(f"   - {user[0]} ({user[1]})")
        
        cursor.close()
        conn.close()
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    check_admin()