from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app import schemas, models, auth, database
from typing import List, Optional

router = APIRouter()

@router.get("/", response_model=List[schemas.PatientOut])
def list_patients(skip: int = 0, limit: int = 100, search: Optional[str] = None,
                  db: Session = Depends(database.get_db),
                  current_user: models.User = Depends(auth.get_current_user)):
    query = db.query(models.Patient).filter(models.Patient.status == "active")
    if search:
        query = query.filter(models.Patient.name.ilike(f"%{search}%"))
    patients = query.offset(skip).limit(limit).all()
    return patients

@router.post("/", response_model=schemas.PatientOut, status_code=201)
def create_patient(patient: schemas.PatientCreate, db: Session = Depends(database.get_db),
                   current_user: models.User = Depends(auth.get_current_user)):
    existing = db.query(models.Patient).filter(models.Patient.phone == patient.phone).first()
    if existing:
        raise HTTPException(status_code=400, detail="Phone already registered")
    db_patient = models.Patient(**patient.dict())
    db.add(db_patient)
    db.commit()
    db.refresh(db_patient)
    return db_patient

@router.put("/{patient_id}", response_model=schemas.PatientOut)
def update_patient(patient_id: int, patient_update: schemas.PatientUpdate,
                   db: Session = Depends(database.get_db),
                   current_user: models.User = Depends(auth.get_current_user)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    for key, value in patient_update.dict(exclude_unset=True).items():
        setattr(patient, key, value)
    db.commit()
    db.refresh(patient)
    return patient

@router.delete("/{patient_id}", status_code=204)
def delete_patient(patient_id: int, db: Session = Depends(database.get_db),
                   current_user: models.User = Depends(auth.get_current_user)):
    patient = db.query(models.Patient).filter(models.Patient.id == patient_id).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found")
    patient.status = "inactive"
    db.commit()