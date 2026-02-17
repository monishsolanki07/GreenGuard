from django.urls import path
from .views import UploadEmissionView,CompanyComplianceHistoryView,CompanyDashboardView

urlpatterns = [
    path('upload/', UploadEmissionView.as_view(), name='upload-emission'),
    path("history/", CompanyComplianceHistoryView.as_view()),
    path("dashboard/", CompanyDashboardView.as_view(), name="dashboard"),
]
