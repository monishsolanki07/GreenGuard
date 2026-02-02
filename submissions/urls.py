from django.urls import path
from .views import UploadEmissionView

urlpatterns = [
    path('upload/', UploadEmissionView.as_view(), name='upload-emission'),
]
