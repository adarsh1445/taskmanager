from unittest.mock import Mock
from services.task import create_task, get_tasks, delete_task
from schemas.task import TaskCreate
from models.task import Task

def test_task_creation():
    mock_db = Mock()
    task_data = TaskCreate(
        title="Test Task",
        description="Test Description",
        due_date="2023-12-31"
    )
    user_id = 1
    
    task = create_task(mock_db, task_data, user_id)
    
    assert isinstance(task, Task)
    assert task.user_id == user_id
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()

def test_get_user_tasks():
    mock_db = Mock()
    mock_user_id = 1
    mock_tasks = [Task(), Task()]
    mock_db.query.return_value.filter.return_value.offset.return_value.limit.return_value.all.return_value = mock_tasks
    
    tasks = get_tasks(mock_db, mock_user_id)
    assert len(tasks) == 2