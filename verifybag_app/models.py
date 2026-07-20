

# Create your models here.
from django.db import models
from django.contrib.auth.models import User


class DrugVerification(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    drug_image = models.ImageField(
        upload_to="drug_images/"
    )

    nafdac_number = models.CharField(
        max_length=100,
        blank=True
    )

    result = models.CharField(
        max_length=50,
        default="Pending"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return self.user.username
    
class ApprovedDrug(models.Model):

    drug_name = models.CharField(
        max_length=200
    )

    manufacturer = models.CharField(
        max_length=200
    )

    nafdac_number = models.CharField(
        max_length=100,
        unique=True
    )

    batch_number = models.CharField(
        max_length=100,
        blank=True
    )

    dosage_form = models.CharField(
        max_length=100,
        blank=True
    )

    strength = models.CharField(
        max_length=100,
        blank=True
    )

    expiry_date = models.DateField()

    manufacture_date = models.DateField(
        null=True,
        blank=True
    )

    is_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.drug_name
    
class FakeDrugReport(models.Model):

    STATUS_CHOICES = [
        ("Pending", "Pending"),
        ("Under Review", "Under Review"),
        ("Resolved", "Resolved"),
    ]

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    verification = models.ForeignKey(
        DrugVerification,
        on_delete=models.CASCADE
    )

    pharmacy_name = models.CharField(
        max_length=200
    )

    state = models.CharField(
        max_length=100
    )

    reason = models.TextField()

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="Pending"
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):

        return f"{self.pharmacy_name} - {self.verification.nafdac_number}"
    

class UserProfile(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    pharmacy_name = models.CharField(
        max_length=200,
        blank=True
    )

    phone = models.CharField(
        max_length=20,
        blank=True
    )

    state = models.CharField(
        max_length=100,
        blank=True
    )

    pharmacy_license = models.CharField(
    max_length=100,
    blank=True
    )

    profile_picture = models.ImageField(
        upload_to="profiles/",
        blank=True,
        null=True
    )

    # NEW FIELDS
    is_pharmacy_approved = models.BooleanField(
        default=False
    )

    is_pharmacy_active = models.BooleanField(
        default=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    def __str__(self):
        return self.user.username