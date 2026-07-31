from sqlalchemy.orm import Session
from ..models.doctor import Doctor
from ..models.patient import Patient
from ..models.appointment import Appointment
from datetime import date

class DashboardService:
    def __init__(self, db: Session):
        self.db = db
    
    def get_summary(self):
        total_doctors = self.db.query(Doctor).count()
        total_patients = self.db.query(Patient).count()
        today = date.today()
        today_appointments = self.db.query(Appointment).filter(Appointment.appointment_date == today).count()
        pending = self.db.query(Appointment).filter(Appointment.status == "Scheduled").count()
        completed = self.db.query(Appointment).filter(Appointment.status == "Completed").count()
        cancelled = self.db.query(Appointment).filter(Appointment.status == "Cancelled").count()
        
        return {
            "totalDoctors": total_doctors,
            "totalPatients": total_patients,
            "todayAppointments": today_appointments,
            "pending": pending,
            "completed": completed,
            "cancelled": cancelled
        }