from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404

from submissions.models import ComplianceResult
from .services.report_generator import generate_compliance_report

from django.http import FileResponse
import os

class GenerateReportView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, submission_id):

        result = get_object_or_404(ComplianceResult, pk=submission_id)

        file_url = generate_compliance_report(result)

        file_path = result.report_file.path

        return FileResponse(
            open(file_path, 'rb'),
            content_type='application/pdf',
            as_attachment=True,
            filename=f"compliance_report_{submission_id}.pdf"
        )