from sqlalchemy.orm import Session
from ..repositories.doctor_repository import DoctorRepository
from ..schemas.doctor import DoctorCreate, DoctorUpdate
import uuid

class DoctorService:
    def __init__(self, db: Session):
        self.repo = DoctorRepository(db)
    
    def get_all(self, skip: int = 0, limit: int = 100, search: str = None):
        if search:
            return self.repo.search_by_name(search, skip, limit)
        return self.repo.get_all(skip, limit)
    
    def get_by_id(self, doctor_id: uuid.UUID):
        return self.repo.get_by_id(doctor_id)
    
    def create(self, data: DoctorCreate):
        return self.repo.create(
            doctor_name=data.doctor_name,
            specialization=data.specialization,
            phone=data.phone,
            email=data.email,
            experience=data.experience,
            availability=data.availability,
            is_active=True
        )
    
    def update(self, doctor_id: uuid.UUID, data: DoctorUpdate):
        update_data = data.dict(exclude_unset=True)
        return self.repo.update(doctor_id, **update_data)
    
    def delete(self, doctor_id: uuid.UUID):
        return self.repo.delete(doctor_id)