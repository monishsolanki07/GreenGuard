from rest_framework import serializers
from .models import EmissionSubmission

class EmissionSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmissionSubmission
        fields = ('id', 'files', 'time_uploaded')
