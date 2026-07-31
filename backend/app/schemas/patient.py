from pydantic import BaseModel, EmailStr, Field, validator
from typing import Optional
from datetime import datetime
from uuid import UUID

class PatientCreate(BaseModel):
    patient_name: str = Field(..., min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=15)
    email: Optional[EmailStr] = Field(None, max_length=100)
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[str] = Field(None, max_length=10)
    address: Optional[str] = None
    visit_reason: Optional[str] = None

class PatientUpdate(BaseModel):
    patient_name: Optional[str] = Field(None, min_length=1, max_length=100)
    phone: Optional[str] = Field(None, max_length=15)
    email: Optional[EmailStr] = Field(None, max_length=100)
    age: Optional[int] = Field(None, ge=0, le=150)
    gender: Optional[str] = Field(None, max_length=10)
    address: Optional[str] = None
    visit_reason: Optional[str] = None
    is_active: Optional[bool] = None

class PatientOut(BaseModel):
    patient_id: UUID
    patient_name: str
    phone: Optional[str] = None
    email: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    address: Optional[str] = None
    visit_reason: Optional[str] = None
    is_active: bool
    created_at: datetime
    updated_at: Optional[datetime] = None
    
    class Config:
        from_attributes = True