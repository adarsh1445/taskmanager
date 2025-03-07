from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from schemas.user import UserCreate, UserLogin, UserOut
from services.auth import authenticate_user, get_current_user, create_user
from utils.security import create_access_token, get_password_hash
from database.postgres import get_db
from models.user import User

router = APIRouter(tags=["Authentication"])

@router.post("/api/register", response_model=UserOut, status_code=status.HTTP_201_CREATED)
def register(user: UserCreate, db: Session = Depends(get_db)):
    try:
        new_user = create_user(user_data=user, db=db)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(e))
    return new_user


@router.post("/api/login", status_code=status.HTTP_200_OK)
def login(user: UserLogin, db: Session = Depends(get_db)):
    user_obj = authenticate_user(user.email, user.password, db)
    
    if not user_obj:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    access_token = create_access_token(data={"sub": user.email})
    
    response = JSONResponse(content={"message": "Login successful"})
    response.set_cookie(key="access_token",
                        value=access_token, 
                        max_age= 30 * 60,
                        httponly=True,
                        secure=False,
                        samesite="Strict"
                        )
    response.set_cookie(
        key="email",
        value=user.email,
        max_age= 30 * 60,
        httponly=True,
        secure=False,
        samesite="Strict"
    )
    return response


@router.get("/api/me", response_model=UserOut, status_code=status.HTTP_200_OK)
async def read_users_me(current_user: User = Depends(get_current_user)):
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return current_user


@router.post("/api/logout")
async def logout():
    response = JSONResponse(content={"message": "Logged out successfully"})
    response.delete_cookie("access_token", httponly=True,secure=True,samesite="Strict")
    response.delete_cookie("username", httponly=True, secure=True, samesite="Strict")
    return response