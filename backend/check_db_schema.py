from app.core.database import engine
from sqlalchemy import inspect

def check_schema():
    inspector = inspect(engine)
    
    # Get all tables
    tables = inspector.get_table_names()
    print(f"📋 Tables in database: {tables}")
    
    if 'users' in tables:
        # Get columns for users table
        columns = inspector.get_columns('users')
        print(f"\n📋 Users table columns:")
        for col in columns:
            print(f"   - {col['name']}: {col['type']}")
    else:
        print("❌ Users table not found!")

if __name__ == "__main__":
    check_schema()