from pydantic import BaseModel, UUID4
from typing import Optional

class Token(BaseModel):
    access_token: str
    token_type: str

class LoginRequest(BaseModel):
    username: str
    password: str

class UserOut(BaseModel):
    user_id: UUID4
    full_name: str
    username: str
    email: str
    role: str
    is_active: bool
    
    class Config:
        from_attributes = True