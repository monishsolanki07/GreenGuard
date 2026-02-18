from rest_framework.viewsets import ModelViewSet
from .models import PollutantPolicy
from .serializers import PollutantPolicySerializer
from users.permissions import IsAdmin


class PollutantPolicyViewSet(ModelViewSet):
    queryset = PollutantPolicy.objects.all()
    serializer_class = PollutantPolicySerializer
    permission_classes = [IsAdmin]
