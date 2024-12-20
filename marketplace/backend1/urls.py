from django.urls import path, include
from .views import register_user, login_user, verify_token, send_verification_email, sell_product, ProductViewSet
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet)

urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('verify-token/', verify_token, name='verify-token'),
    path('send-verification-email/', send_verification_email, name='send-verification-email'),
    path('sell/', sell_product, name='sell'),
    path('', include(router.urls)),
]
