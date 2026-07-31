import re
from datetime import date, datetime

def validate_phone(phone: str) -> bool:
    """Validate phone number (basic)"""
    return bool(re.match(r'^\+?[0-9]{10,15}$', phone))

def validate_email(email: str) -> bool:
    """Simple email validation"""
    return bool(re.match(r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$', email))

def generate_code(prefix: str, length: int = 4) -> str:
    """Generate a random code with prefix"""
    import random
    return f"{prefix}-{random.randint(10**(length-1), 10**length - 1)}"

def is_future_date(date_obj: date) -> bool:
    """Check if date is today or future"""
    return date_obj >= date.today()