from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from schemas.task import TaskCreate, TaskOut
from services.task import (
    create_task,
    get_tasks,
    get_task,
    update_task,
    delete_task
)
from services.auth import get_current_user
from database.postgres import get_db
from models.user import User

router = APIRouter(tags=["Tasks"])

@router.post("/api/tasks", response_model=TaskOut, status_code=status.HTTP_201_CREATED)
def create_new_task(
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
   
    return create_task(db=db, task=task, user_id=current_user.id)

@router.get("/api/tasks", response_model=list[TaskOut], status_code=status.HTTP_200_OK)
def read_tasks(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_tasks(db=db, user_id=current_user.id, skip=skip, limit=limit)

@router.get("/api/tasks/{task_id}", response_model=TaskOut, status_code=status.HTTP_200_OK)
def read_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    task = get_task(db=db, task_id=task_id, user_id=current_user.id)
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return task

@router.put("/api/tasks/{task_id}", response_model=TaskOut, status_code=status.HTTP_200_OK)
def update_existing_task(
    task_id: int,
    task: TaskCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    updated_task = update_task(db=db, task_id=task_id, task=task, user_id=current_user.id)
    if not updated_task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return updated_task

@router.delete("/api/tasks/{task_id}", status_code=status.HTTP_200_OK)
def delete_existing_task(
    task_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    deleted = delete_task(db=db, task_id=task_id, user_id=current_user.id)
    if not deleted:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return {"detail": "Task successfully deleted"}
