from django.db import models

class SessionManager(models.Manager):
    def create_session(self, ):