from unicodedata import name

from django.urls import path

from . import views


urlpatterns = [

    path("", views.home, name="home"),

    path("register/", views.register, name="register"),

    path("login/", views.login_view, name="login"),

    path("forgot-password/", views.forgot_password, name="forgot_password"),

    path("verify-drug/", views.verify_drug, name="verify_drug"),

    path("logout/", views.logout_view, name="logout"),

    path("verification-history/", views.verification_history, name="verification_history"),

    path("delete-verification/<int:id>", views.delete_verification, name="delete_verification"),

    path("report-fake-drug/<int:id>/", views.report_fake_drug, name="report_fake_drug"),

    path("dashboard/", views.dashboard, name="dashboard"),

    path("ocr-scan/", views.ocr_scan, name="ocr_scan"),

    path("profile/", views.profile, name="profile"),

    path("about/", views.about, name="about"),

    path("features/", views.features, name="features"),

    path("pricing/", views.pricing, name="pricing"),

    path("contact/", views.contact, name="contact"),

]