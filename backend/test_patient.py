import requests
import json

def test_patient_creation():
    # 1. Login
    login_url = "http://localhost:8000/api/v1/auth/login"
    login_data = {
        "username": "admin",
        "password": "admin123"
    }
    
    print("🔐 Logging in...")
    login_response = requests.post(login_url, data=login_data)
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    token = login_response.json().get("access_token")
    print(f"✅ Login successful! Token: {token[:50]}...")
    
    # 2. Create patient
    patient_url = "http://localhost:8000/api/v1/patients/"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }
    patient_data = {
        "patient_name": "John Doe",
        "phone": "9876543210",
        "age": 30,
        "gender": "Male",
        "address": "123 Main St",
        "visit_reason": "Checkup"
    }
    
    print("📤 Creating patient...")
    patient_response = requests.post(patient_url, json=patient_data, headers=headers)
    
    print(f"📊 Status Code: {patient_response.status_code}")
    print(f"📄 Response: {patient_response.text}")
    
    if patient_response.status_code == 201:
        print("✅ Patient created successfully!")
    else:
        print("❌ Patient creation failed!")

if __name__ == "__main__":
    test_patient_creation()