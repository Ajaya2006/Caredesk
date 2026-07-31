from .base_repository import BaseRepository
from ..models.doctor import Doctor
from sqlalchemy.orm import Session
from sqlalchemy import or_

class DoctorRepository(BaseRepository[Doctor]):
    def __init__(self, db: Session):
        super().__init__(Doctor, db)
    
    def get_all(self, skip: int = 0, limit: int = 100):
        return self.db.query(self.model).filter(
            self.model.is_active == True
        ).offset(skip).limit(limit).all()
    
    def search_by_name(self, search_term: str, skip: int = 0, limit: int = 100):
        return self.db.query(self.model).filter(
            or_(
                self.model.doctor_name.ilike(f"%{search_term}%"),
                self.model.specialization.ilike(f"%{search_term}%")
            ),
            self.model.is_active == True
        ).offset(skip).limit(limit).all()
    
    def get_by_id(self, doctor_id):
        return self.db.query(self.model).filter(
            self.model.doctor_id == doctor_id
        ).first()
    
    def update(self, doctor_id, **kwargs):
        doctor = self.get_by_id(doctor_id)
        if doctor:
            for key, value in kwargs.items():
                if hasattr(doctor, key):
                    setattr(doctor, key, value)
            self.db.commit()
            self.db.refresh(doctor)
        return doctor
    
    def delete(self, doctor_id):
        doctor = self.get_by_id(doctor_id)
        if doctor:
            doctor.is_active = False
            self.db.commit()
            return True
        return False