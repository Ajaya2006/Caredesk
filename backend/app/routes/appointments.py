from fastapi import APIRouter, Depends, HTTPException, status, Query
from sqlalchemy.orm import Session
from sqlalchemy import and_
from app import schemas, models, auth, database
from typing import List, Optional
from datetime import date, time, datetime

router = APIRouter()

@router.get("/", response_model=List[schemas.AppointmentOut])
def list_appointments(
    skip: int = 0,
    limit: int = 100,
    doctor_id: Optional[int] = None,
    appointment_date: Optional[date] = None,
    status_filter: Optional[str] = None,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    query = db.query(models.Appointment)
    if doctor_id:
        query = query.filter(models.Appointment.doctor_id == doctor_id)
    if appointment_date:
        query = query.filter(models.Appointment.appointment_date == appointment_date)
    if status_filter:
        query = query.filter(models.Appointment.status == status_filter)
    appointments = query.offset(skip).limit(limit).all()
    result = []
    for appt in appointments:
        out = schemas.AppointmentOut.from_orm(appt)
        out.patient_name = appt.patient.name if appt.patient else None
        out.doctor_name = appt.doctor.name if appt.doctor else None
        result.append(out)
    return result

@router.post("/", response_model=schemas.AppointmentOut, status_code=201)
def create_appointment(
    appointment: schemas.AppointmentCreate,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    # Validate patient & doctor
    patient = db.query(models.Patient).filter(and_(models.Patient.id == appointment.patient_id, models.Patient.status == "active")).first()
    if not patient:
        raise HTTPException(status_code=404, detail="Patient not found or inactive")
    doctor = db.query(models.Doctor).filter(and_(models.Doctor.id == appointment.doctor_id, models.Doctor.status == "active")).first()
    if not doctor:
        raise HTTPException(status_code=404, detail="Doctor not found or inactive")
    # Slot conflict prevention
    conflict = db.query(models.Appointment).filter(
        and_(
            models.Appointment.doctor_id == appointment.doctor_id,
            models.Appointment.appointment_date == appointment.appointment_date,
            models.Appointment.appointment_time == appointment.appointment_time,
            models.Appointment.status != "Cancelled"
        )
    ).first()
    if conflict:
        raise HTTPException(status_code=409, detail="Doctor already has an appointment at this time")
    db_appt = models.Appointment(**appointment.dict())
    db.add(db_appt)
    db.commit()
    db.refresh(db_appt)
    out = schemas.AppointmentOut.from_orm(db_appt)
    out.patient_name = patient.name
    out.doctor_name = doctor.name
    return out

@router.put("/{appointment_id}/status", response_model=schemas.AppointmentOut)
def update_appointment_status(
    appointment_id: int,
    status_update: schemas.AppointmentUpdateStatus,
    db: Session = Depends(database.get_db),
    current_user: models.User = Depends(auth.get_current_user)
):
    appointment = db.query(models.Appointment).filter(models.Appointment.id == appointment_id).first()
    if not appointment:
        raise HTTPException(status_code=404, detail="Appointment not found")
    appointment.status = status_update.status
    appointment.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(appointment)
    out = schemas.AppointmentOut.from_orm(appointment)
    out.patient_name = appointment.patient.name if appointment.patient else None
    out.doctor_name = appointment.doctor.name if appointment.doctor else None
    return out