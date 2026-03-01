from .models import User 
from rest_framework import serializers
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer



class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["company_name"] = user.company_name
        token["role"] = user.role

        return token
    

class CompanyRegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True) 
                                                    #(writeonly true gives security that this cant be send back)

    class Meta:
        model= User                                 # telling frontend which model to refer and what fields can be sent
        fields =("username","password","company_name")
    
    def create(self, validated_data):               #creating that user 
        user = User.objects.create_user(
            username=validated_data['username'],
            password=validated_data["password"],
            role="COMPANY",
            company_name=validated_data.get("company_name")
        )
        
        return user 
