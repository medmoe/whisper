import hashlib
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import User, Session


# Create your views here.

class UserSignUpView(APIView):
    def post(self, request):
        data = request.data
        try:
            _ = User.user.create_user(first_name=data['first_name'],
                                      last_name=data['last_name'],
                                      email=data['email'],
                                      username=data['username'],
                                      password=data['password']),
            response_data = {'first_name': data['first_name'],
                             'last_name': data['last_name'],
                             'email': data['email'],
                             'username': data['username']}
            return Response(data=response_data, status=status.HTTP_200_OK)
        except IntegrityError:
            return Response({'message': 'user with the same data already exist!'}, status=status.HTTP_400_BAD_REQUEST)


class UserLoginView(APIView):
    def post(self, request):
        data = request.data
        error_message = {
            'message': 'Credentials are incorrect!',
            'username': data['username'],
            'password': data['password'],
        }
        try:
            user = User.objects.get(username=data['username'])
            hash_func, salt, hash = user.password.split("$")
            digest = hashlib.pbkdf2_hmac(hash_func, data['password'].encode(), salt.encode(), 10000)
            if digest.hex() == hash:
                # create a session
                session = Session.session.create_session(user)
                return Response(data={
                    'message': 'logged in successfully',
                    'session_id': session.session_id,
                    'username': user.username,
                }, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(data=error_message, status=status.HTTP_400_BAD_REQUEST)


class LogoutView(APIView):
    def post(self, request):
        data = request.data
        try:
            user = User.objects.get(username=data['username'])
            session = Session.objects.get(user=user)
            session.delete()
            return Response(data={'message': 'logged out successfully'}, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(data={'message': 'Bad Request'}, status=status.HTTP_400_BAD_REQUEST)
