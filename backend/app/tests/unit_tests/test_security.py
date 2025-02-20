from datetime import timedelta
from utils.security import (
    get_password_hash,
    verify_password,
    create_access_token,
    decode_token
)

def test_password_hashing_and_verification():
    password = "securepassword123"
    hashed = get_password_hash(password)
    assert verify_password(password, hashed)
    assert not verify_password("wrongpassword", hashed)

