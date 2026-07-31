from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.sql import func
from ..core.database import Base
import uuid

class Doctor(Base):
    __tablename__ = "doctors"
    
    doctor_id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    doctor_name = Column(String(100), nullable=False, index=True)
    specialization = Column(String(100), nullable=False)
    phone = Column(String(15), nullable=True)
    email = Column(String(100), nullable=True)
    experience = Column(Integer, nullable=True)
    availability = Column(Text, nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())