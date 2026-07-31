from .base_repository import BaseRepository
from ..models.patient import Patient
from sqlalchemy.orm import Session
from sqlalchemy import or_

class PatientRepository(BaseRepository[Patient]):
    def __init__(self, db: Session):
        super().__init__(Patient, db)
    
    def get_all(self, skip: int = 0, limit: int = 100):
        return self.db.query(self.model).filter(
            self.model.is_active == True
        ).offset(skip).limit(limit).all()
    
    def search_by_name(self, search_term: str, skip: int = 0, limit: int = 100):
        return self.db.query(self.model).filter(
            or_(
                self.model.patient_name.ilike(f"%{search_term}%"),
                self.model.phone.ilike(f"%{search_term}%")
            ),
            self.model.is_active == True
        ).offset(skip).limit(limit).all()
    
    def get_by_id(self, patient_id):
        return self.db.query(self.model).filter(
            self.model.patient_id == patient_id
        ).first()
    
    def update(self, patient_id, **kwargs):
        patient = self.get_by_id(patient_id)
        if patient:
            for key, value in kwargs.items():
                if hasattr(patient, key):
                    setattr(patient, key, value)
            self.db.commit()
            self.db.refresh(patient)
        return patient
    
    def delete(self, patient_id):
        patient = self.get_by_id(patient_id)
        if patient:
            patient.is_active = False
            self.db.commit()
            return True
        return False