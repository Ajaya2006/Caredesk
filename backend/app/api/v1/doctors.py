from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional
from ...core.database import get_db
from ...services.doctor_service import DoctorService
from ...schemas.doctor import DoctorCreate, DoctorUpdate, DoctorOut
from ...core.security import get_current_user
import uuid

router = APIRouter(prefix="/doctors", tags=["Doctors"])

@router.get("/", response_model=List[DoctorOut])
def get_doctors(
    skip: int = Query(0, ge=0),
    limit: int = Query(100, ge=1, le=100),
    search: Optional[str] = None,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = DoctorService(db)
    return service.get_all(skip, limit, search)

@router.get("/{doctor_id}", response_model=DoctorOut)
def get_doctor(
    doctor_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = DoctorService(db)
    doctor = service.get_by_id(doctor_id)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.post("/", response_model=DoctorOut, status_code=status.HTTP_201_CREATED)
def create_doctor(
    data: DoctorCreate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = DoctorService(db)
    return service.create(data)

@router.put("/{doctor_id}", response_model=DoctorOut)
def update_doctor(
    doctor_id: uuid.UUID,
    data: DoctorUpdate,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = DoctorService(db)
    doctor = service.update(doctor_id, data)
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    return doctor

@router.delete("/{doctor_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_doctor(
    doctor_id: uuid.UUID,
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = DoctorService(db)
    if not service.delete(doctor_id):
        raise HTTPException(status_code=404, detail="Doctor not found")
    return None