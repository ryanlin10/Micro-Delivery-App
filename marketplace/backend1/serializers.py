from rest_framework import serializers
from .models import Product, ActiveDelivery, Mydeliveries, OpenDeliveries
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

class ActiveDeliverySerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = ActiveDelivery
        fields = ['id', 'product', 'created_at']


class MydeliveriesSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = Mydeliveries
        fields = ['id', 'product', 'created_at']

class OpenDeliveriesSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)

    class Meta:
        model = OpenDeliveries
        fields = ['id', 'product', 'created_at']