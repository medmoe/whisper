from django.db import models


# Create your models here.
class User(models.Model):
    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=100, unique=True)
    password = models.CharField(max_length=200)
    is_online = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)


class Room(models.Model):
    users = models.ManyToManyField(User)
    name = models.CharField(max_length=100)
    size = models.CharField(max_length=100)
    private = models.BooleanField(default=False)
    created = models.DateTimeField(auto_now_add=True)


class Session(models.Model):
    user = models.OneToOneField(User)
    session_id = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)



