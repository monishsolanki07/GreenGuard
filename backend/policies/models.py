from django.db import models

# Create your models here.

class PollutantPolicy(models.Model) :
    name = models.CharField(max_length=100)
    safe_limit = models.FloatField()
    unit = models.CharField(max_length=50)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name