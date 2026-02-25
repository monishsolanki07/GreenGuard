from django.db import models
from users.models import User
import uuid
import os
# Create your models here.


def submission_upload_path(instance, filename):
    ext = filename.split('.')[-1]
    unique_name = f"{uuid.uuid4()}.{ext}"
    return os.path.join("submissions", unique_name)


class EmissionSubmission(models.Model):
    company = models.ForeignKey(User,on_delete=models.DO_NOTHING)
    files = models.FileField(upload_to=submission_upload_path)
    time_uploaded=models.DateTimeField(auto_now_add=True)
    

    def __str__ (self):
        return f'{self.company} - {self.time_uploaded}'


class ComplianceResult(models.Model):

    STATUS_CHOICES = (
        ("COMPLIANT", "Compliant"),
        ("NON_COMPLIANT", "Non Compliant"),
        ("REVIEW_REQUIRED", "Review Required"),
    )

    submission = models.OneToOneField(
        EmissionSubmission,
        on_delete=models.CASCADE,
        related_name="compliance"
    )

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES
    )

    violations = models.JSONField(default=list)
    safe_items = models.JSONField(default=list)
    unknown_items = models.JSONField(default=list)
    created_at = models.DateTimeField(auto_now_add=True)
    report_file = models.FileField(upload_to="reports/", null=True, blank=True)

    risk_score = models.IntegerField(default=0)
    threat_level = models.CharField(
        max_length=10,
        choices=(
          ("LOW", "Low"),
          ("MEDIUM", "Medium"),
          ("HIGH", "High"),
       ),
       default="LOW"
)