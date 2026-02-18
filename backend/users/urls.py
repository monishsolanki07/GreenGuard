from django.urls import path
from . import views

urlpatterns =[
    path("register/", views.CompanyRegisterView.as_view(), name="register")
]