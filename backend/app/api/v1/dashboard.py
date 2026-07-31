from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from ...core.database import get_db
from ...services.dashboard_service import DashboardService
from ...core.security import get_current_user

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/summary")
def get_summary(
    db: Session = Depends(get_db),
    current_user = Depends(get_current_user)
):
    service = DashboardService(db)
    return service.get_summary()