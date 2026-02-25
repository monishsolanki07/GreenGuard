from django.urls import path
from .views import GenerateReportView

urlpatterns = [
    path("generate/<int:submission_id>/", GenerateReportView.as_view()),
]