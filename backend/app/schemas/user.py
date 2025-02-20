from pydantic import BaseModel, EmailStr, constr

class UserCreate(BaseModel):
    email: EmailStr
    password: constr(min_length=6)  # Correct use of constr for password field

class UserLogin(BaseModel):
    email: EmailStr
    password: constr(min_length=6)  # Correct use of constr for password field

class UserOut(BaseModel):
    email: EmailStr
    is_active: bool

    class Config:
        orm_mode = True
