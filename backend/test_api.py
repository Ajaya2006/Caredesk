import requests
import json

# Test getting patients
def test_patients():
    # First login to get token
    login_response = requests.post(
        "http://localhost:8000/api/v1/auth/login",
        data={"username": "admin", "password": "admin123"},
        headers={"Content-Type": "application/x-www-form-urlencoded"}
    )
    
    if login_response.status_code != 200:
        print(f"❌ Login failed: {login_response.status_code}")
        print(login_response.text)
        return
    
    token = login_response.json().get("access_token")
    print(f"✅ Login successful, token: {token[:30]}...")
    
    # Get patients
    patients_response = requests.get(
        "http://localhost:8000/api/v1/patients/",
        headers={"Authorization": f"Bearer {token}"}
    )
    
    print(f"\n📋 Patients Response Status: {patients_response.status_code}")
    if patients_response.status_code == 200:
        patients = patients_response.json()
        print(f"📋 Patients in database: {len(patients)}")
        for patient in patients:
            print(f"   - {patient.get('patient_name')} (ID: {patient.get('patient_id')})")
    else:
        print(f"❌ Error: {patients_response.text}")

if __name__ == "__main__":
    test_patients()