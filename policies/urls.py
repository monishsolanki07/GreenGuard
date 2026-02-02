from rest_framework.routers import DefaultRouter
from .views import PollutantPolicyViewSet

router = DefaultRouter()
router.register('policies', PollutantPolicyViewSet)

urlpatterns = router.urls
