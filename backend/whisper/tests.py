from channels.testing import ChannelsLiveServerTestCase
from rest_framework import status
from rest_framework.test import APITestCase
from selenium import webdriver
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.common.by import By
from selenium.webdriver.support.wait import WebDriverWait
from .models import User, Session, Room


# Create your tests here.

class TestAuthenticationSystemHandlers(APITestCase):
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

    def test_user_can_retrieve_info(self):
        _ = self.client.post('/signup/', data=self.data, format='json')
        _ = self.client.post('/login/', {'username': 'username', 'password': 'secret'}, format='json')
        response = self.client.get('/user/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['first_name'], self.data['first_name'])
        self.assertEqual(response.data['last_name'], self.data['last_name'])
        self.assertEqual(response.data['email'], self.data['email'])
        self.assertEqual(response.data['username'], self.data['username'])
        _ = self.client.post('/logout/', data={'username': 'username'}, format='json')
        response = self.client.get('/user/')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TestRoomHandlers(APITestCase):
    def setUp(self):
        user = User.user.create_user(first_name="first",
                                     last_name="last",
                                     email='test@test.com',
                                     username='med',
                                     password='secret', )
        room = Room(owner=user, name="room1", category=Room.Category.BUILDINGS, size="100")
        room.save()
        room1 = Room(owner=user, name="room2", category=Room.Category.BUILDINGS, size="102")
        room1.save()

    def test_user_can_get_rooms_list(self):
        login_response = self.client.post('/login/', data={'username': 'med', 'password': 'secret'}, format='json')
        self.assertEqual(login_response.status_code, status.HTTP_200_OK)
        response = self.client.get('/rooms/?category=buildings')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2)

    def test_user_can_create_room(self):
        _ = self.client.post('/login/', data={'username': 'med', 'password': 'secret'}, format='json')
        room_data = {
            "name": 'room193',
            "category": 'buildings',
            "size": "199",
        }
        response = self.client.post('/rooms/', data=room_data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(Room.objects.all()), 3)

    #
    def test_user_can_get_room(self):
        _ = self.client.post('/login/', data={'username': 'med', 'password': 'secret'}, format='json')
        rooms = Room.objects.all()
        response = self.client.get(f'/rooms/{rooms[0].pk}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'room1')

    def test_user_can_update_room(self):
        _ = self.client.post('/login/', data={'username': 'med', 'password': 'secret'}, format='json')
        room_data = {
            "name": 'room193',
            "category": 'buildings',
            "size": "199",
        }
        response_of_created_room = self.client.post('/rooms/', data=room_data, format='json')
        data = response_of_created_room.data
        data['name'] = 'updated_room_name'
        response = self.client.put(f'/rooms/{data["id"]}/', data=data, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['name'], 'updated_room_name')

    def test_user_can_delete_room(self):
        _ = self.client.post('/login/', data={'username': 'med', 'password': 'secret'}, format='json')
        room_data = {
            "name": 'room193',
            "category": 'buildings',
            "size": "199",
        }
        response_of_created_room = self.client.post('/rooms/', data=room_data, format='json')
        self.assertEqual(len(Room.objects.all()), 3)
        response = self.client.delete(f'/rooms/{response_of_created_room.data["id"]}/',
                                      data=response_of_created_room.data)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertEqual(len(Room.objects.all()), 2)