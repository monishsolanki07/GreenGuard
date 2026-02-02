from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from rest_framework.response import Response
from users.permissions import IsCompany
from .serializers import EmissionSubmissionSerializer


class UploadEmissionView(APIView):
    parser_classes = [MultiPartParser]
    permission_classes = [IsCompany]

    def post(self, request):
        serializer = EmissionSubmissionSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=400)

        serializer.save(company=request.user)
        return Response({"message": "CSV uploaded successfully"}, status=201)
