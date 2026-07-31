from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app import schemas, models, auth, database
from datetime import date

router = APIRouter()

@router.get("/summary", response_model=schemas.DashboardSummary)
def get_dashboard_summary(db: Session = Depends(database.get_db),
                          current_user: models.User = Depends(auth.get_current_user)):
    total_doctors = db.query(models.Doctor).filter(models.Doctor.status == "active").count()
    total_patients = db.query(models.Patient).filter(models.Patient.status == "active").count()
    today = date.today()
    today_appointments = db.query(models.Appointment).filter(models.Appointment.appointment_date == today).count()
    pending = db.query(models.Appointment).filter(models.Appointment.status == "Scheduled").count()
    confirmed = db.query(models.Appointment).filter(models.Appointment.status == "Checked-in").count()
    return {
        "total_doctors": total_doctors,
        "total_patients": total_patients,
        "today_appointments": today_appointments,
        "pending_appointments": pending,
        "confirmed_appointments": confirmed
    }