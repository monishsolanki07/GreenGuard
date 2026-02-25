from django.urls import path
from .views.dashboard import AdminDashboardView
from .views.companies import (
    AdminCompanyListView,
    AdminCompanyDetailView,
    AdminCompanyStatusUpdateView,
)
from .views.submissions import AdminSubmissionListView
from .views.high_risk import AdminHighRiskView
from .views.audit import AdminAuditView


urlpatterns = [
    path("dashboard/", AdminDashboardView.as_view()),

    path("companies/", AdminCompanyListView.as_view()),
    path("companies/<int:pk>/", AdminCompanyDetailView.as_view()),
    path("companies/<int:pk>/status/", AdminCompanyStatusUpdateView.as_view()),

    path("submissions/", AdminSubmissionListView.as_view()),
    path("high-risk/", AdminHighRiskView.as_view()),
    path("audit/", AdminAuditView.as_view()),
]