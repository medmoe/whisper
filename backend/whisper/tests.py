from rest_framework import status

from rest_framework.test import APITestCase
from .models import User, Session


# Create your tests here.

class TestAuthenticationSystem(APITestCase):
    data = {
        'first_name': 'first',
        'last_name': 'last',
        'email': 'email',
        'username': 'username',
        'password': 'secret',
    }

    def test_user_can_sign_up(self):
        response = self.client.post('/signup/', data=self.data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        user = User.objects.get(username="username")
        self.assertIsNotNone(user)

    def test_user_can_log_in(self):
        _ = self.client.post('/signup/', data=self.data, format='json')
        response = self.client.post('/login/', data={'username': 'username', 'password': 'secret'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_user_can_log_out(self):
        _ = self.client.post('/signup/', data=self.data, format='json')
        _ = self.client.post('/login/', data={'username': 'username', 'password': 'secret'}, format='json')
        response = self.client.post('/logout/', data={'username': 'username'}, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        users = User.objects.filter(username="username")
        sessions = Session.objects.filter(user=users[0])
        self.assertFalse(sessions)
