from fastapi.testclient import TestClient
from main import app
from database.postgres import get_db
import pytest

client = TestClient(app)


def test_full_auth_flow():
    
    client.base_url = "http://backend:8000"

    response = client.post("/api/register", json={
    "email": "test@integration.com",
    "password": "intpass"
    })
    
    print(response.json())
    assert response.status_code == 201
    assert response.json()["email"] == "test@integration.com"
    
    login_res = client.post("/api/login", json={
        "email": "test@integration.com",
        "password": "intpass"
    })
    assert login_res.status_code == 200
    print(login_res.json())
    token = login_res.json()["access_token"]
    
    me_res = client.get("/api/me", headers={"Authorization": f"Bearer {token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "test@integration.com"