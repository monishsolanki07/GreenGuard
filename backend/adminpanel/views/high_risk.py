from rest_framework.generics import ListAPIView
from users.permissions import IsAdmin
from submissions.models import ComplianceResult
from adminpanel.serializers import AdminSubmissionSerializer
from django.db.models import Q


class AdminHighRiskView(ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminSubmissionSerializer

    def get_queryset(self):
        min_risk = self.request.query_params.get("min_risk", 8)
        urgent = self.request.query_params.get("urgent")

        queryset = ComplianceResult.objects.select_related(
            "submission__company"
        )

        # Base condition: HIGH threat or risk above threshold
        high_risk_filter = Q(threat_level="HIGH") | Q(risk_score__gte=min_risk)

        if urgent == "true":
            # More aggressive filter for urgent cases
            high_risk_filter = Q(risk_score__gte=9)

        return queryset.filter(high_risk_filter).order_by("-risk_score")