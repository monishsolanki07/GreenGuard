from django.db import models
from django.contrib.auth.models import AbstractUser 
# Create your models here.


class User(AbstractUser) :
    ROLE_CHOICES = (
        ('ADMIN','Admin'),
        ('COMPANY','Company'),
    )

    role=models.CharField(max_length=20,choices=ROLE_CHOICES)
    company_name= models.CharField(max_length=255,blank=True,null=True)

    def __str__(self):
        return self.username