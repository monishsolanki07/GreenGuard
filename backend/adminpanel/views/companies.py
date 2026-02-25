from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from users.permissions import IsAdmin
from users.models import User
from adminpanel.serializers import AdminCompanySerializer


# 📋 List All Companies
class AdminCompanyListView(ListAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminCompanySerializer

    def get_queryset(self):
        return User.objects.filter(role="COMPANY")


# 🔍 Company Detail
class AdminCompanyDetailView(RetrieveAPIView):
    permission_classes = [IsAdmin]
    serializer_class = AdminCompanySerializer
    queryset = User.objects.filter(role="COMPANY")


# 🔄 Activate / Deactivate Company
class AdminCompanyStatusUpdateView(APIView):
    permission_classes = [IsAdmin]

    def patch(self, request, pk):
        try:
            company = User.objects.get(pk=pk, role="COMPANY")
        except User.DoesNotExist:
            return Response({"error": "Company not found"}, status=404)

        is_active = request.data.get("is_active")
        if is_active is None:
            return Response(
                {"error": "is_active field required"},
                status=400
            )

        company.is_active = is_active
        company.save()

        return Response({
            "message": "Company status updated",
            "is_active": company.is_active
        })