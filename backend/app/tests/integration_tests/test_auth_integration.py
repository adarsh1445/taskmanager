from fastapi.testclient import TestClient
from main import app
from database.postgres import get_db
import pytest

client = TestClient(app)

def test_full_auth_flow():
    client.base_url = "http://backend:8000"

    # Register a new user.
    register_res = client.post("/api/register", json={
        "email": "test@integration.com",
        "password": "intpass"
    })
    print(register_res.json())
    assert register_res.status_code == 201
    assert register_res.json()["email"] == "test@integration.com"
    

    login_res = client.post("/api/login", json={
        "email": "test@integration.com",
        "password": "intpass"
    })
    print(login_res.json())
    assert login_res.status_code == 200
    
    
    token = login_res.cookies.get("access_token")
    assert token is not None
    
    me_res = client.get("/api/me")
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "test@integration.com"
