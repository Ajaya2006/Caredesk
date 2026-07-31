from fastapi import Depends
from sqlalchemy.orm import Session
from .database import get_db
from .security import get_current_user
from ..models.user import User

async def get_current_active_user(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    if not current_user.is_active:
        raise HTTPException(status_code=400, detail="Inactive user")
    return current_user