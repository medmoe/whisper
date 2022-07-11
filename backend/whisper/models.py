from django.db import models
from .managers import SessionManager, UserManager


# Create your models here.
class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=200)
    is_online = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)
    objects = models.Manager()
    user = UserManager()


class Room(models.Model):
    users = models.ManyToManyField(User)
    name = models.CharField(max_length=100)
    size = models.CharField(max_length=100)
    private = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)


class Session(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    session_id = models.CharField(max_length=100, default=None)
    created = models.DateTimeField(auto_now_add=True)
    objects = models.Manager()
    session = SessionManager()



