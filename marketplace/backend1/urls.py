from django.urls import path, include
from .views import register_user, login_user, verify_token, send_verification_email, sell_product, ProductViewSet, verification_status,accept_delivery, ActiveDeliveryViewSet, MydeliveriesViewSet, OpenDeliveriesViewSet, MyOrdersViewSet, delivery_authentication, credit
from rest_framework import routers

router = routers.DefaultRouter()
router.register(r'products', ProductViewSet, basename='products')
router.register(r'active-delivery', ActiveDeliveryViewSet, basename='active-delivery')
router.register(r'mydeliveries', MydeliveriesViewSet, basename='mydeliveries')
router.register(r'open-deliveries', OpenDeliveriesViewSet, basename='open-deliveries')
router.register(r'myorders', MyOrdersViewSet, basename='myorders')
urlpatterns = [
    path('register/', register_user, name='register'),
    path('login/', login_user, name='login'),
    path('verify-token/', verify_token, name='verify-token'),
    path('send-verification-email/', send_verification_email, name='send-verification-email'),
    path('sell/', sell_product, name='sell'),
    path('verification-status/', verification_status, name='verification-status'),
    path('accept-delivery/', accept_delivery, name='accept-delivery'),
    path('delivery_authentication/', delivery_authentication, name='delivery-authentication'),
    path('credit/', credit, name='credit'),
    path('', include(router.urls)),
]