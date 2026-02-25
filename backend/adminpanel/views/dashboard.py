from rest_framework.views import APIView
from rest_framework.response import Response
from django.db.models import Count, Avg, Max
from django.db.models.functions import TruncMonth
from users.permissions import IsAdmin
from users.models import User
from submissions.models import ComplianceResult


class AdminDashboardView(APIView):
    permission_classes = [IsAdmin]

    def get(self, request):

        # 1️⃣ Total Companies (excluding deleted if you add soft delete later)
        total_companies = User.objects.filter(
            role="COMPANY",
            is_active=True
        ).count()

        # 2️⃣ Total Submissions
        total_submissions = ComplianceResult.objects.count()

        # 3️⃣ Compliance Distribution
        compliant_count = ComplianceResult.objects.filter(status="COMPLIANT").count()
        non_compliant_count = ComplianceResult.objects.filter(status="NON_COMPLIANT").count()
        review_required_count = ComplianceResult.objects.filter(status="REVIEW_REQUIRED").count()

        # 4️⃣ Average Risk Score
        avg_risk = ComplianceResult.objects.aggregate(
            avg=Avg("risk_score")
        )["avg"] or 0

        # 5️⃣ Threat Level Breakdown
        threat_breakdown = ComplianceResult.objects.values(
            "threat_level"
        ).annotate(
            count=Count("id")
        )

        # 6️⃣ Top 5 Highest Risk Companies
        top_companies = (
            ComplianceResult.objects
            .values("submission__company__company_name")
            .annotate(avg_risk=Avg("risk_score"))
            .order_by("-avg_risk")[:5]
        )

        # 7️⃣ Submission Volume Trend (Monthly)
        monthly_trend = (
            ComplianceResult.objects
            .annotate(month=TruncMonth("created_at"))
            .values("month")
            .annotate(total=Count("id"))
            .order_by("month")
        )

        return Response({
            "total_companies": total_companies,
            "total_submissions": total_submissions,

            "compliance_distribution": {
                "compliant": compliant_count,
                "non_compliant": non_compliant_count,
                "review_required": review_required_count,
            },

            "average_risk_score": round(avg_risk, 2),

            "threat_level_breakdown": list(threat_breakdown),

            "top_5_highest_risk_companies": list(top_companies),

            "submission_volume_trend": list(monthly_trend),
        })