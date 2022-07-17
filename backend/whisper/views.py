import json
import hashlib
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from django.http import Http404
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .models import User, Session, Room
from .serializers import UserSignUpSerializer, RoomSerializer
from .decorators import is_authenticated


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
        response = Response()
        try:
            user = User.objects.get(username=data['username'])
            hash_func, salt, hash = user.password.split("$")
            digest = hashlib.pbkdf2_hmac(hash_func, data['password'].encode(), salt.encode(), 10000)
            if digest.hex() == hash:
                # create a session
                session = Session.session.create_session(user)
                response.set_cookie('session_id', session.session_id, httponly=True)
                response.data = {'message': 'logged in successfully', 'username': user.username}
                response.status_code = status.HTTP_200_OK
                return response
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


class UserInfoView(APIView):
    def get(self, request):
        try:
            session = Session.objects.get(session_id=request.COOKIES.get('session_id'))
            response_data = {
                'first_name': session.user.first_name,
                'last_name': session.user.last_name,
                'email': session.user.email,
                'username': session.user.username
            }
            return Response(data=response_data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response(data={'message': 'Bad request'}, status=status.HTTP_400_BAD_REQUEST)


class RoomsListView(APIView):
    @is_authenticated
    def get(self, request):
        rooms = Room.objects.all()
        serializer = RoomSerializer(rooms, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @is_authenticated
    def post(self, request):
        serializer = RoomSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(data=serializer.data, status=status.HTTP_200_OK)
        return Response(data=serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class RoomDetailView(APIView):
    def get_object(self, pk):
        try:
            return Room.objects.get(pk=pk)
        except ObjectDoesNotExist:
            raise Http404

    @is_authenticated
    def get(self, request, pk):
        room = self.get_object(pk)
        serializer = RoomSerializer(room)
        return Response(serializer.data, status=status.HTTP_200_OK)

    @is_authenticated
    def put(self, request, pk):
        room = self.get_object(pk)
        serializer = RoomSerializer(room, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @is_authenticated
    def delete(self, request, pk):
        room = self.get_object(pk)
        room.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
