from rest_framework import serializers
from .models import Product
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']

class ProductSerializer(serializers.ModelSerializer):
    seller = UserSerializer(read_only=True)


    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'seller', 'created_at', 'dropoff_location', 'pickup_location']

