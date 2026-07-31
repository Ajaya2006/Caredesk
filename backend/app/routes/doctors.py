from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import schemas, models, auth, database
from typing import List

router = APIRouter()

@router.get("/", response_model=List[schemas.DoctorOut])
def list_doctors(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db),
                 current_user: models.User = Depends(auth.get_current_user)):
    doctors = db.query(models.Doctor).filter(models.Doctor.status == "active").offset(skip).limit(limit).all()
    return doctors

@router.post("/", response_model=schemas.DoctorOut, status_code=201)
def create_doctor(doctor: schemas.DoctorCreate, db: Session = Depends(database.get_db),
                  current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    db_doctor = models.Doctor(**doctor.dict())
    db.add(db_doctor)
    db.commit()
    db.refresh(db_doctor)
    return db_doctor

@router.put("/{doctor_id}", response_model=schemas.DoctorOut)
def update_doctor(doctor_id: int, doctor_update: schemas.DoctorUpdate,
                  db: Session = Depends(database.get_db),
                  current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    for key, value in doctor_update.dict(exclude_unset=True).items():
        setattr(doctor, key, value)
    db.commit()
    db.refresh(doctor)
    return doctor

@router.delete("/{doctor_id}", status_code=204)
def delete_doctor(doctor_id: int, db: Session = Depends(database.get_db),
                  current_user: models.User = Depends(auth.get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    doctor = db.query(models.Doctor).filter(models.Doctor.id == doctor_id).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found")
    doctor.status = "inactive"
    db.commit()