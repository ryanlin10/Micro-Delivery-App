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
from .serializers import ProductSerializer
from rest_framework.decorators import action
from rest_framework import permissions
from .models import Verification, Mydeliveries
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

        Product.objects.create(
            seller=seller,
            name=name,
            description=description,
            price=price,
            dropoff_location=dropoff_location,
            pickup_location=pickup_location
        )
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

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def mydeliveries(request):
    user = request.user
    mydeliveries = Mydeliveries.objects.filter(user=user).values('product')
    return Response({'mydeliveries': mydeliveries}, status=status.HTTP_200_OK)
