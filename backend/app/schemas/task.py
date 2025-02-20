from pydantic import BaseModel
from datetime import datetime
from models.task import TaskStatus, TaskPriority

class TaskBase(BaseModel):
    title: str
    description: str | None = None
    status: TaskStatus = TaskStatus.todo
    priority: TaskPriority = TaskPriority.medium
    due_date: datetime | None = None
    assignee: str | None = None

class TaskCreate(TaskBase):
    pass

class TaskOut(TaskBase):
    id: int
    user_id: int

    class Config:
        orm_mode = True