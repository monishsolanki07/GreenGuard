from rest_framework import serializers
from .models import EmissionSubmission,ComplianceResult

class EmissionSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmissionSubmission
        fields = ('id', 'files', 'time_uploaded')

class ComplianceResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = ComplianceResult
        fields = "__all__"