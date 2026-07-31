from sqlalchemy.orm import Session
from ..repositories.patient_repository import PatientRepository
from ..schemas.patient import PatientCreate, PatientUpdate
import uuid

class PatientService:
    def __init__(self, db: Session):
        self.repo = PatientRepository(db)
    
    def get_all(self, skip: int = 0, limit: int = 100, search: str = None):
        if search:
            return self.repo.search_by_name(search, skip, limit)
        return self.repo.get_all(skip, limit)
    
    def get_by_id(self, patient_id: uuid.UUID):
        return self.repo.get_by_id(patient_id)
    
    def create(self, data: PatientCreate):
        return self.repo.create(
            patient_name=data.patient_name,
            phone=data.phone,
            email=data.email,
            age=data.age,
            gender=data.gender,
            address=data.address,
            visit_reason=data.visit_reason,
            is_active=True
        )
    
    def update(self, patient_id: uuid.UUID, data: PatientUpdate):
        update_data = data.dict(exclude_unset=True)
        return self.repo.update(patient_id, **update_data)
    
    def delete(self, patient_id: uuid.UUID):
        return self.repo.delete(patient_id)