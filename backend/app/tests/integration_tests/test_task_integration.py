from fastapi.testclient import TestClient
from main import app
from database.postgres import get_db
import pytest

client = TestClient(app)

def test_task_operations():
    # Register a new user.
    register_res = client.post("/api/register", json={
        "email": "taskuser@test.com",
        "password": "taskpass"
    })
    assert register_res.status_code == 201

    # Log in with the newly registered user.
    login_res = client.post("/api/login", json={
        "email": "taskuser@test.com",
        "password": "taskpass"
    })
    assert login_res.status_code == 200

 
    token = login_res.cookies.get("access_token")
    assert token is not None


    task_data = {
        "title": "Integration Task",
        "description": "Test integration",
        "due_date": "2023-12-31"
    }

    headers = {"Authorization": f"Bearer {token}"}
    create_res = client.post("/api/tasks", json=task_data, headers=headers)
    assert create_res.status_code == 201
    created_task = create_res.json()
    assert created_task["title"] == "Integration Task"

    get_res = client.get("/api/tasks", headers=headers)
    assert get_res.status_code == 200
    tasks = get_res.json()
    assert len(tasks) == 1
    assert tasks[0]["id"] == created_task["id"]

