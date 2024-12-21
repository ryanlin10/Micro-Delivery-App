from django.shortcuts import render
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import Product
from rest_framework.decorators import api_view
from rest_framework import status
from rest_framework.authtoken.models import Token
from django.core.exceptions import ValidationError
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.conf import settings
from django.template.loader import render_to_string
from django.utils.crypto import get_random_string
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes
from rest_framework import viewsets
from .serializers import ProductSerializer, ActiveDeliverySerializer, MydeliveriesSerializer, OpenDeliveriesSerializer, MyOrdersSerializer
from rest_framework.decorators import action
from rest_framework import permissions
from .models import Verification, Mydeliveries, ActiveDelivery, OpenDeliveries, Profile
@api_view(['POST'])
def register_user(request):
    try:
        # Get data from request
        username = request.data.get('username')
        email = request.data.get('email')
        password = request.data.get('password')

        # Validate data
        if not username or not email or not password:
            return Response(
                {'error': 'Please provide all required fields'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if user already exists
        if User.objects.filter(username=username).exists():
            return Response(
                {'error': 'Username already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        if User.objects.filter(email=email).exists():
            return Response(
                {'error': 'Email already exists'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        # Create user
        user = User.objects.create_user(
            username=username,
            email=email,
            password=password
        )

        # Create token
        token = Token.objects.create(user=user)

        # Return response with token
        return Response({
            'token': token.key,
            'user': {
                'id': user.id,
                'username': user.username,
                'email': user.email
            }
        }, status=status.HTTP_201_CREATED)

    except ValidationError as e:
        return Response(
            {'error': str(e)}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    except Exception as e:
        return Response(
            {'error': 'Something went wrong'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
@api_view(['POST'])
def login_user(request):
    
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if not user:
        return Response(
            {'error': 'Invalid credentials'},
            status=status.HTTP_401_UNAUTHORIZED
        )
    
    token, _ = Token.objects.get_or_create(user=user)

    return Response({
        'token': token.key,
        'user': {
            'id': user.id, 'username': user.username, 'email': user.email}
    })


@api_view(['GET'])
def verify_token(request):
    token = request.headers.get('Authorization').split(' ')[1]
    token = Token.objects.get(key=token)
    return Response({'message': 'Token is valid'}, status=status.HTTP_200_OK)


@api_view(['POST'])
def send_verification_email(request):
    try:
        email = request.data.get('email')
        
        if not email:
            return Response(
                {'error': 'Email is required'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        verification_code = get_random_string(length=6, allowed_chars='0123456789')

        subject = 'Email Verification Code'
        message = f'Your verification code is: {verification_code}'
        from_email = settings.EMAIL_HOST_USER
        recipient_list = [email]
        
        send_mail(
            subject=subject,
            message=message,
            from_email=from_email,
            recipient_list=recipient_list,
            fail_silently=False,
        )

        return Response({
            'message': 'Verification email sent', 
            'verification_code': verification_code
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Email error: {str(e)}")  # For debugging
        return Response({
            'error': 'Failed to send email'
        }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
import random

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def sell_product(request):
    try:
        seller = request.user
        name = request.data.get('name')
        description = request.data.get('description')
        price = request.data.get('price')
        dropoff_location = request.data.get('dropoff_location')
        pickup_location = request.data.get('pickup_location')
        authentication_code = random.randint(1000, 9999)
        quantity = request.data.get('quantity')
        buyer_latitude = request.data.get('buyer_latitude')
        buyer_longitude = request.data.get('buyer_longitude')

        Product.objects.create(
            seller=seller,
            name=name,
            description=description,
            price=price,
            dropoff_location=dropoff_location,
            pickup_location=pickup_location,
            authentication_code=authentication_code,
            quantity=quantity,
            buyer_latitude=buyer_latitude,
            buyer_longitude=buyer_longitude
        )

        delivery_fee = int(price)*int(quantity)*0.1
        commission = int(price)*int(quantity)*0.05

        total_cost = int(price)*int(quantity) + delivery_fee + commission

        profile = Profile.objects.get(user=seller)
        if profile.credit < total_cost:
            return Response({'error': 'Insufficient credit, please add more money to your account'}, status=status.HTTP_400_BAD_REQUEST)
        profile.credit = profile.credit - total_cost
        profile.save()
        return Response({'message': 'Product listed successfully'}, status=status.HTTP_200_OK)
    except Exception as e:
        print(f"Error listing product: {str(e)}")
        print(f"Seller: {request.user}")
        return Response({'error': 'Failed to list product', 'error_detail': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class OpenDeliveriesViewSet(viewsets.ModelViewSet):
    serializer_class = OpenDeliveriesSerializer
    queryset = OpenDeliveries.objects.all() 
    permission_classes = [IsAuthenticated]

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

@api_view(['POST', 'GET'])
@permission_classes([IsAuthenticated])
def verification_status(request):
    user = request.user
    if request.method == 'POST':
        email = request.data.get('email')
        verification_status = request.data.get('verification_status')
        try:
            verification = Verification.objects.get(user=user)
            verification.verification_status = verification_status
            verification.save()
            return Response({'message': 'Email verified'}, status=status.HTTP_200_OK)
        except Verification.DoesNotExist:
            return Response({'error': 'Verification record not found'}, status=status.HTTP_404_NOT_FOUND)
    else:  # GET request
        try:
            verification = Verification.objects.get(user=user)
            return Response({'verification_status': verification.verification_status}, status=status.HTTP_200_OK)
        except Verification.DoesNotExist:
            return Response({'error': 'Verification record not found'}, status=status.HTTP_404_NOT_FOUND)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def accept_delivery(request):
    product_id = request.data.get('product_id')
    user = request.user
    Mydeliveries.objects.create(user=user, product_id=product_id)
    ActiveDelivery.objects.create(product_id=product_id, deliverer=user)
    OpenDeliveries.objects.filter(product_id=product_id).delete()
    return Response({'message': 'Delivery accepted'}, status=status.HTTP_200_OK)

class MydeliveriesViewSet(viewsets.ModelViewSet):
    serializer_class = MydeliveriesSerializer
    permission_classes = [IsAuthenticated]
    queryset = Mydeliveries.objects.all()

    def get_queryset(self):
        # Only return deliveries where the current user is the deliverer
        return Mydeliveries.objects.filter(user=self.request.user)
    
    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class ActiveDeliveryViewSet(viewsets.ModelViewSet):
    serializer_class = ActiveDeliverySerializer
    permission_classes = [IsAuthenticated]
    queryset = ActiveDelivery.objects.all()

    def get_queryset(self):
        # Only return deliveries where the current user is the deliverer
        return ActiveDelivery.objects.filter(deliverer=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

class MyOrdersViewSet(viewsets.ModelViewSet):
    serializer_class = MyOrdersSerializer
    permission_classes = [IsAuthenticated]
    queryset = Product.objects.all()

    def get_queryset(self):
        # Only return the orders of the current user
        return Product.objects.filter(seller=self.request.user)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['request'] = self.request
        return context
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def delivery_authentication(request):
    try:
        code = int(request.data.get('code'))  # Convert to int since authentication_code is IntegerField
        product_id = request.data.get('product_id')
        
        # Get the product and active delivery in one query to verify both exist
        product = Product.objects.get(id=product_id)
        active_delivery = ActiveDelivery.objects.get(
            deliverer=request.user,
            product_id=product_id
        )

        if product.authentication_code == code:
            active_delivery.delete()
            profile = Profile.objects.get(user=request.user)
            delivery_fee = product.price*product.quantity*0.1
            profile.credit = profile.credit + delivery_fee + product.price*product.quantity
            profile.save()
            return Response({'message': 'success'}, status=status.HTTP_200_OK)
        else:
            return Response(
                {'error': 'Invalid authentication code'}, 
                status=status.HTTP_400_BAD_REQUEST
            )

    except (Product.DoesNotExist, ActiveDelivery.DoesNotExist):
        return Response(
            {'error': 'Product or active delivery not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except ValueError:
        return Response(
            {'error': 'Invalid code format'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def credit(request):
    try:
        profile = Profile.objects.get(user=request.user)
        return Response({'credit': profile.credit}, status=status.HTTP_200_OK)
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Profile not found'}, 
            status=status.HTTP_404_NOT_FOUND
        )
    
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_credit(request):
    try:
        credit = request.data.get('credit')
        if not isinstance(credit, (int, float)) or credit <= 0:
            return Response(
                {'error': 'Invalid credit amount'}, 
                status=status.HTTP_400_BAD_REQUEST
            )
            
        profile = Profile.objects.get(user=request.user)
        profile.credit = profile.credit + credit
        profile.save()
        
        return Response(
            {
                'message': 'Credit added successfully',
                'new_balance': profile.credit
            }, 
            status=status.HTTP_200_OK
        )
    except Profile.DoesNotExist:
        return Response(
            {'error': 'Profile not found'},
            status=status.HTTP_404_NOT_FOUND
        )
    except Exception as e:
        return Response(
            {'error': str(e)},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )