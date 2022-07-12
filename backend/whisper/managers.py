import uuid
import hashlib
from django.db import models


class SessionManager(models.Manager):
    def create_session(self, user):
        key = str(uuid.uuid4()).split("-")[0]
        session = self.create(user=user, session_id=hashlib.sha256(key.encode()).hexdigest())
        return session


class UserManager(models.Manager):
    def create_user(self, first_name, last_name, email, username, password):
        salt = str(uuid.uuid4()).split("-")[0]
        digest = hashlib.pbkdf2_hmac('sha256', password.encode(), salt.encode(), 10000)
        hash = f'sha256${salt}${digest.hex()}'
        user = self.create(first_name=first_name,
                           last_name=last_name,
                           email=email,
                           username=username,
                           password=hash)
        return user
