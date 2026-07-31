from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import date, time, datetime

class AppointmentCreate(BaseModel):
    patient_id: UUID4
    doctor_id: UUID4
    appointment_date: date
    appointment_time: time
    reason: Optional[str] = None
    remarks: Optional[str] = None

class AppointmentUpdate(BaseModel):
    appointment_date: Optional[date] = None
    appointment_time: Optional[time] = None
    status: Optional[str] = None
    reason: Optional[str] = None
    remarks: Optional[str] = None

class AppointmentStatusUpdate(BaseModel):
    status: str

class AppointmentOut(BaseModel):
    appointment_id: UUID4
    patient_id: UUID4
    doctor_id: UUID4
    appointment_date: date
    appointment_time: time
    reason: Optional[str] = None
    status: str
    remarks: Optional[str] = None
    created_at: datetime
    updated_at: Optional[datetime] = None
    patient_name: Optional[str] = None
    doctor_name: Optional[str] = None
    
    class Config:
        from_attributes = True