from django.urls import path
from .views import UserSignUpView, UserLoginView, LogoutView
urlpatterns = [
    path('signup/', UserSignUpView.as_view()),
    path('login/', UserLoginView.as_view()),
    path('logout/', LogoutView.as_view()),
]