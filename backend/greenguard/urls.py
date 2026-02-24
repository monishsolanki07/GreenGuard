from django.contrib import admin
from django.urls import path, include

from users.views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static
urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/login/', CustomTokenObtainPairView.as_view()),
    path('api/refresh/', TokenRefreshView.as_view()),

    path('api/', include('policies.urls')),
    path('api/submissions/', include('submissions.urls')), 
]
