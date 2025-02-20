import pytest
from unittest.mock import Mock
from services.auth import create_user, authenticate_user
from schemas.user import UserCreate
from models.user import User
from sqlalchemy.orm import Session
from utils.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_token
)

def test_create_user_success():
    mock_db = Mock(spec=Session)
    mock_db.query.return_value.filter.return_value.first.return_value = None
    user_data = UserCreate(email="test@example.com", password="password")
    
    new_user = create_user(user_data, mock_db)
    
    assert isinstance(new_user, User)
    mock_db.add.assert_called_once()
    mock_db.commit.assert_called_once()
    mock_db.refresh.assert_called_once()

def test_create_user_duplicate_email():
    mock_db = Mock()
    mock_db.query.return_value.filter.return_value.first.return_value = User()
    user_data = UserCreate(email="exists@example.com", password="password")
    
    with pytest.raises(ValueError, match="Email already registered"):
        create_user(user_data, mock_db)

def test_authenticate_user_valid():
    mock_db = Mock()
    mock_user = User(email="user@test.com", hashed_password=get_password_hash("pass"))
    mock_db.query.return_value.filter.return_value.first.return_value = mock_user
    
    user = authenticate_user("user@test.com", "pass", mock_db)
    assert user == mock_user

def test_authenticate_user_invalid_password():
    mock_db = Mock()
    mock_user = User(email="user@test.com", hashed_password=get_password_hash("pass"))
    mock_db.query.return_value.filter.return_value.first.return_value = mock_user
    
    user = authenticate_user("user@test.com", "wrongpass", mock_db)
    assert user is None