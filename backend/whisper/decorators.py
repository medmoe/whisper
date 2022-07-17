from django.core.exceptions import ObjectDoesNotExist
from rest_framework import status
from rest_framework.response import Response
from .models import Session


def is_authenticated(func):
    def wrapper(*args, **kwargs):
        try:
            session = Session.objects.get(session_id=args[1].COOKIES.get('session_id'))
            if args[1].method == "POST":
                args[1].data['owner'] = session.user.id
            return func(*args, **kwargs)
        except ObjectDoesNotExist:
            return Response(status=status.HTTP_401_UNAUTHORIZED)
    return wrapper
