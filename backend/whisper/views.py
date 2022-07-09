import hashlib
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status
from .helpers import create_hash
from .serializers import UserSignUpSerializer
from .models import User, Session


# Create your views here.

class UserSignUpView(APIView):
    def post(self, request):
        data = request.data
        data['password'] = create_hash(data['password'])
        serializer = UserSignUpSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            response_data = {field_name: value for field_name, value in serializer.data.items() if field_name != 'password'}
            return Response(data=response_data, status=status.HTTP_200_OK)
        return Response({'message':'user with the same data already exist!'}, status=status.HTTP_400_BAD_REQUEST)


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
                pass
        except ObjectDoesNotExist:
            pass




class LogoutView(APIView):
    def post(self, request):
        pass
