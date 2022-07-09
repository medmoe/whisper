import uuid
import hashlib


def create_hash(password):
    salt = str(uuid.uuid4()).split("-")[0]
    digest = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 10000)
    return f'sha256${salt}${digest.hex()}'
