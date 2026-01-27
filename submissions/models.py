from django.db import models
from users.models import User
# Create your models here.

class EmissionSubmission(models.Model):
    company = models.ForeignKey(User,on_delete=models.DO_NOTHING)
    files=models.FileField(upload_to="uploads/")
    time_uploaded=models.DateTimeField(auto_now_add=True)

    def __str__ (self):
        return f'{self.company} - {self.time_uploaded}'




