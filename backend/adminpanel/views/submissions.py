from rest_framework.generics import ListAPIView
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework.filters import OrderingFilter
from users.permissions import IsAdmin
from submissions.models import ComplianceResult
from adminpanel.serializers import AdminSubmissionSerializer


class AdminSubmissionListView(ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminSubmissionSerializer

    queryset = ComplianceResult.objects.select_related(
        "submission__company"
    ).all().order_by("-created_at")

    filter_backends = [DjangoFilterBackend, OrderingFilter]

    filterset_fields = [
        "status",
        "threat_level",
        "submission__company",
    ]

    ordering_fields = [
        "risk_score",
        "created_at",
    ]