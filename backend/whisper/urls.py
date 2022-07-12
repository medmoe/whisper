from django.urls import path
from .views import UserSignUpView, UserLoginView, LogoutView, UserInfoView
urlpatterns = [
    path('signup/', UserSignUpView.as_view()),
    path('login/', UserLoginView.as_view()),
    path('logout/', LogoutView.as_view()),
    path('user/', UserInfoView.as_view()),
]