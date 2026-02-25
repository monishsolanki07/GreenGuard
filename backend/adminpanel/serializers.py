from rest_framework import serializers
from users.models import User
from submissions.models import ComplianceResult
from django.db.models import Avg
from submissions.models import ComplianceResult

class AdminCompanySerializer(serializers.ModelSerializer):
    submission_count = serializers.SerializerMethodField()
    average_risk = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = [
            "id",
            "username",
            "company_name",
            "is_active",
            "submission_count",
            "average_risk",
        ]

    def get_submission_count(self, obj):
        return ComplianceResult.objects.filter(
            submission__company=obj
        ).count()

    def get_average_risk(self, obj):
        avg = ComplianceResult.objects.filter(
            submission__company=obj
        ).aggregate(avg=Avg("risk_score"))["avg"]

        return round(avg, 2) if avg else 0
    

class AdminSubmissionSerializer(serializers.ModelSerializer):
    company_name = serializers.CharField(
        source="submission.company.company_name",
        read_only=True
    )

    class Meta:
        model = ComplianceResult
        fields = [
            "id",
            "company_name",
            "status",
            "risk_score",
            "threat_level",
            "created_at",
        ]