from django.shortcuts import render
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .serializers import CompanyRegisterSerializer
from rest_framework.permissions import AllowAny

# Create your views here.

class CompanyRegisterView(APIView):
    permission_classes=[AllowAny]

    def post(self,request):

        serializer=CompanyRegisterSerializer(data=request.data)
        if(serializer.is_valid()):
            serializer.save()
            return Response(
                {
                    "response":"Success"
                },
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)  

