from fastapi.testclient import TestClient
from main import app
from database.postgres import get_db
import pytest

client = TestClient(app)


def test_task_operations():
    client.post("/api/register", json={
        "email": "taskuser@test.com",
        "password": "taskpass"
    })
    login_res = client.post("/api/login",json={
        "email": "taskuser@test.com",
        "password": "taskpass"
    })
    token = login_res.json()["access_token"]
    
    task_data = {
        "title": "Integration Task",
        "description": "Test integration",
        "due_date": "2023-12-31"
    }
    create_res = client.post("/api/tasks", json=task_data, headers={
        "Authorization": f"Bearer {token}"
    })
    assert create_res.status_code == 201
    created_task = create_res.json()
    assert created_task["title"] == "Integration Task"
    
    # Get tasks
    get_res = client.get("/api/tasks", headers={"Authorization": f"Bearer {token}"})
    assert get_res.status_code == 200
    assert len(get_res.json()) == 1
    assert get_res.json()[0]["id"] == created_task["id"]
    
    # Unauthorized access
    unauthorized_res = client.get("/api/tasks")
    assert unauthorized_res.status_code == 401