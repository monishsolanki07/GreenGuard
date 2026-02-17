from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView
from rest_framework.views import APIView
from users.permissions import IsCompany
from .serializers import EmissionSubmissionSerializer, ComplianceResultSerializer
from .models import ComplianceResult
from submissions.services.compliance_engine import evaluate_submission
from django.db.models import Avg, Max, Count


class UploadEmissionView(APIView):
    """
    Handles CSV upload, validates, evaluates compliance,
    and stores structured result.
    """

    parser_classes = [MultiPartParser]
    permission_classes = [IsCompany]

    def post(self, request):
        serializer = EmissionSubmissionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        submission = serializer.save(company=request.user)

        try:
            result = evaluate_submission(submission.files.path)
        except ValueError as e:
            submission.delete()
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

        ComplianceResult.objects.create(
            submission=submission,
            status=result["status"],
            violations=result["violations"],
            safe_items=result["safe"],
            unknown_items=result["unknown"],
            risk_score=result["risk_score"],
            threat_level=result["threat_level"],
        )

        return Response(
    {
        "submission_id": submission.id,
        "status": result["status"],
        "risk_score": result["risk_score"],
        "threat_level": result["threat_level"],
        "summary": {
            "total_violations": len(result["violations"]),
            "total_safe": len(result["safe"]),
            "total_unknown": len(result["unknown"]),
        },
        "violations": result["violations"],
    },
    status=status.HTTP_201_CREATED
)


class CompanyComplianceHistoryView(ListAPIView):
    """
    Returns compliance history for logged-in company.
    """

    permission_classes = [IsCompany]
    serializer_class = ComplianceResultSerializer

    def get_queryset(self):
        return ComplianceResult.objects.filter(
            submission__company=self.request.user
        ).order_by("-created_at")



class CompanyDashboardView(APIView):
    """
    Returns analytical summary for logged-in company.
    """

    permission_classes = [IsCompany]

    def get(self, request):
        queryset = ComplianceResult.objects.filter(
            submission__company=request.user
        ).order_by("created_at")

        total_submissions = queryset.count()

        if total_submissions == 0:
            return Response({
                "total_submissions": 0,
                "message": "No submissions found."
            })

        compliant_count = queryset.filter(status="COMPLIANT").count()
        non_compliant_count = queryset.filter(status="NON_COMPLIANT").count()
        review_required_count = queryset.filter(status="REVIEW_REQUIRED").count()

        average_risk = queryset.aggregate(
            avg_risk=Avg("risk_score")
        )["avg_risk"] or 0

        highest_threat = queryset.aggregate(
            max_threat=Max("threat_level")
        )["max_threat"]

        # Trend calculation (last 3 submissions vs previous 3)
        last_three = list(queryset.values_list("risk_score", flat=True))[-3:]
        previous_three = list(queryset.values_list("risk_score", flat=True))[-6:-3]

        if previous_three and last_three:
            if sum(last_three) < sum(previous_three):
                trend = "IMPROVING"
            elif sum(last_three) > sum(previous_three):
                trend = "DETERIORATING"
            else:
                trend = "STABLE"
        else:
            trend = "INSUFFICIENT_DATA"

        return Response({
            "total_submissions": total_submissions,
            "compliant_count": compliant_count,
            "non_compliant_count": non_compliant_count,
            "review_required_count": review_required_count,
            "average_risk_score": round(average_risk, 2),
            "highest_threat_level": highest_threat,
            "recent_trend": trend
        })