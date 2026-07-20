from django.contrib import admin
from .models import (
    ApprovedDrug,
    DrugVerification,
    FakeDrugReport,
    UserProfile,
)


@admin.register(UserProfile)
class UserProfileAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "pharmacy_name",
        "pharmacy_license",
        "phone",
        "state",
        "is_pharmacy_approved",
        "is_pharmacy_active",
        "created_at",
    )

    list_filter = (
        "is_pharmacy_approved",
        "is_pharmacy_active",
        "state",
    )

    search_fields = (
        "user__username",
        "user__email",
        "pharmacy_name",
        "pharmacy_license",
        "state",
    )

    list_editable = (
        "is_pharmacy_approved",
        "is_pharmacy_active",
    )

    ordering = ("-created_at",)


@admin.register(ApprovedDrug)
class ApprovedDrugAdmin(admin.ModelAdmin):

    list_display = (
        "drug_name",
        "manufacturer",
        "nafdac_number",
        "batch_number",
        "dosage_form",
        "strength",
        "expiry_date",
        "is_active",
    )

    search_fields = (
        "drug_name",
        "manufacturer",
        "nafdac_number",
        "batch_number",
    )

    list_filter = (
        "is_active",
        "dosage_form",
    )

    list_editable = (
        "is_active",
    )

    ordering = ("drug_name",)

@admin.register(DrugVerification)
class DrugVerificationAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "nafdac_number",
        "result",
        "created_at",
    )

    search_fields = (
        "nafdac_number",
        "user__username",
    )

    list_filter = (
        "result",
    )

    ordering = ("-created_at",)


@admin.register(FakeDrugReport)
class FakeDrugReportAdmin(admin.ModelAdmin):

    list_display = (
        "user",
        "pharmacy_name",
        "state",
        "status",
        "created_at",
    )

    list_filter = (
        "state",
        "status",
    )

    search_fields = (
        "pharmacy_name",
        "state",
        "user__username",
    )

    list_editable = (
        "status",
    )

    ordering = ("-created_at",)