from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Product(models.Model):
    seller = models.ForeignKey(
        User, 
        on_delete=models.CASCADE,
        related_name='products'
    )
    name = models.CharField(max_length=100)
    description = models.TextField()
    price = models.DecimalField(max_digits=10, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)
    dropoff_location = models.CharField(max_length=100, default='Balliol College')
    pickup_location = models.CharField(max_length=100, default='Cornmarket Street')
    authentication_code = models.IntegerField(default=0)
    quantity = models.IntegerField(default=1)
    
    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.name} (Sold by {self.seller.username})"

    

class Verification(models.Model):
    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
        related_name='verification'
    )
    email = models.EmailField(unique=True)
    verification_status = models.CharField(
        max_length=20,
        choices=[
            ('unverified', 'Unverified'),
            ('pending', 'Pending'),
            ('verified', 'Verified'),
        ],
        default='unverified',
        help_text='The verification status of the user.',
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.email} - {self.verification_status}"

# Signal to create a Verification instance when a new User is created
@receiver(post_save, sender=User)
def create_user_verification(sender, instance, created, **kwargs):
    if created:
        Verification.objects.create(user=instance, email=instance.email)


class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    stripe_customer_id = models.CharField(max_length=100, blank=True, null=True)
    credit = models.IntegerField(default=0)

@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance)

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    instance.profile.save()


class Mydeliveries(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='mydeliveries')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='mydeliveries')
    created_at = models.DateTimeField(auto_now_add=True)


class ActiveDelivery(models.Model):
    deliverer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='active_deliveries')
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='active_deliveries')
    created_at = models.DateTimeField(auto_now_add=True)


class OpenDeliveries(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='open_deliveries')
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.product.name} - {self.created_at}"
    
@receiver(post_save, sender=Product)
def create_open_delivery(sender, instance, created, **kwargs):
    if created:
        OpenDeliveries.objects.create(product=instance)