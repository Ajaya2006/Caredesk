from sqlalchemy.orm import Session
from ..repositories.appointment_repository import AppointmentRepository
from ..repositories.doctor_repository import DoctorRepository
from ..repositories.patient_repository import PatientRepository
from ..schemas.appointment import AppointmentCreate, AppointmentUpdate
from ..schemas.appointment import AppointmentOut
from datetime import date, time

class AppointmentService:
    def __init__(self, db: Session):
        self.db = db
        self.repo = AppointmentRepository(db)
        self.doctor_repo = DoctorRepository(db)
        self.patient_repo = PatientRepository(db)
    
    def get_all(
        self,
        skip: int = 0,
        limit: int = 100,
        patient_id: int = None,
        doctor_id: int = None,
        status: str = None,
        appointment_date: date = None
    ):
        appointments = self.repo.get_with_filters(
            skip, limit, patient_id, doctor_id, status, appointment_date
        )
        # Enrich with names
        result = []
        for appt in appointments:
            out = AppointmentOut.from_orm(appt)
            if appt.patient:
                out.patient_name = appt.patient.patient_name
            if appt.doctor:
                out.doctor_name = appt.doctor.doctor_name
            result.append(out)
        return result
    
    def get_by_id(self, appointment_id: int):
        appt = self.repo.get_by_id(appointment_id)
        if appt:
            out = AppointmentOut.from_orm(appt)
            if appt.patient:
                out.patient_name = appt.patient.patient_name
            if appt.doctor:
                out.doctor_name = appt.doctor.doctor_name
            return out
        return None
    
    def create(self, data: AppointmentCreate):
        # Verify patient and doctor exist
        patient = self.patient_repo.get_by_id(data.patient_id)
        if not patient:
            raise ValueError("Patient not found")
        doctor = self.doctor_repo.get_by_id(data.doctor_id)
        if not doctor:
            raise ValueError("Doctor not found")
        
        # Create appointment
        return self.repo.create(
            patient_id=data.patient_id,
            doctor_id=data.doctor_id,
            appointment_date=data.appointment_date,
            appointment_time=data.appointment_time,
            reason=data.reason,
            remarks=data.remarks,
            status="Scheduled"
        )
    
    def update(self, appointment_id: int, data: AppointmentUpdate):
        update_data = data.dict(exclude_unset=True)
        return self.repo.update(appointment_id, **update_data)
    
    def update_status(self, appointment_id: int, status: str):
        return self.repo.update(appointment_id, status=status)
    
    def delete(self, appointment_id: int):
        return self.repo.delete(appointment_id)