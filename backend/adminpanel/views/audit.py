from rest_framework.views import APIView
from rest_framework.response import Response
from users.permissions import IsAdmin
from submissions.models import ComplianceResult
from django.db.models import Count, Avg


class AdminAuditView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):

        results = ComplianceResult.objects.select_related(
            "submission__company"
        )

        # 1️⃣ Most Violated Pollutant
        violation_counter = {}

        for result in results:
            for violation in result.violations:
                pollutant = violation.get("pollutant")
                if pollutant:
                    violation_counter[pollutant] = violation_counter.get(pollutant, 0) + 1

        most_violated = (
            max(violation_counter.items(), key=lambda x: x[1])
            if violation_counter else None
        )

        # 2️⃣ Unknown Pollutant Frequency
        unknown_count = sum(len(r.unknown_items) for r in results)

        # 3️⃣ Repeated Offenders (Companies with > 2 HIGH cases)
        repeated_offenders = (
            results
            .filter(threat_level="HIGH")
            .values("submission__company__company_name")
            .annotate(high_cases=Count("id"))
            .filter(high_cases__gt=2)
            .order_by("-high_cases")
        )

        # 4️⃣ Companies With Highest Average Risk
        high_risk_companies = (
            results
            .values("submission__company__company_name")
            .annotate(avg_risk=Avg("risk_score"))
            .order_by("-avg_risk")[:5]
        )

        return Response({
            "most_violated_pollutant": {
                "name": most_violated[0],
                "count": most_violated[1]
            } if most_violated else None,

            "total_unknown_pollutants": unknown_count,

            "repeated_offenders": list(repeated_offenders),

            "top_5_highest_average_risk_companies": list(high_risk_companies),
        })