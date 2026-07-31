from .base_repository import BaseRepository
from ..models.appointment import Appointment
from sqlalchemy.orm import Session
from sqlalchemy import and_, or_
from datetime import date
from typing import Optional
import uuid

class AppointmentRepository(BaseRepository[Appointment]):
    def __init__(self, db: Session):
        super().__init__(Appointment, db)
    
    def get_with_filters(
        self,
        skip: int = 0,
        limit: int = 100,
        patient_id: Optional[uuid.UUID] = None,
        doctor_id: Optional[uuid.UUID] = None,
        status: Optional[str] = None,
        appointment_date: Optional[date] = None
    ):
        query = self.db.query(self.model)
        filters = []
        if patient_id:
            filters.append(self.model.patient_id == patient_id)
        if doctor_id:
            filters.append(self.model.doctor_id == doctor_id)
        if status:
            filters.append(self.model.status == status)
        if appointment_date:
            filters.append(self.model.appointment_date == appointment_date)
        if filters:
            query = query.filter(and_(*filters))
        return query.offset(skip).limit(limit).all()