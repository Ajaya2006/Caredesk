from pydantic import BaseModel, UUID4
from typing import Optional
from datetime import datetime

class DoctorCreate(BaseModel):
    doctor_name: str
    specialization: str
    phone: Optional[str] = None
    email: Optional[str] = None
    experience: Optional[int] = None
    availability: Optional[str] = None

class DoctorUpdate(BaseModel):
    doctor_name: Optional[str] = None
    specialization: Optional[str] = None
    phone: Optional[str] = None
    email: Optional[str] = None
    experience: Optional[int] = None
    availability: Optional[str] = None
    is_active: Optional[bool] = None

class DoctorOut(BaseModel):
    doctor_id: UUID4
    doctor_name: str
    specialization: str
    phone: Optional[str] = None
    email: Optional[str] = None
    experience: Optional[int] = None
    availability: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True