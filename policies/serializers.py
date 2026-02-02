from rest_framework import serializers
from .models import PollutantPolicy


class PollutantPolicySerializer(serializers.ModelSerializer):
    class Meta :
        model = PollutantPolicy
        fields = "__all__"