from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.models import User
from django.contrib import messages
from django.contrib.auth import authenticate, login as auth_login, logout
from django.contrib.auth.decorators import login_required
from .models import DrugVerification, ApprovedDrug, FakeDrugReport, UserProfile
from django.db.models import Count
from django.db.models.functions import TruncMonth
from django.utils import timezone
from django.http import JsonResponse
import pytesseract
from PIL import Image
import re
pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"
from django.core.mail import send_mail
from django.conf import settings


from .forms import RegisterForm


def home(request):

    return render(request, "home.html")

def login_view(request):

    if "next" in request.GET:

        messages.info(
            request,
            "Please login or register before verifying drugs."
        )

    if request.method == "POST":

        print("POST received")

        email = request.POST.get("email")
        password = request.POST.get("password")

        user = authenticate(
            request,
            username=email,
            password=password
        )

        if user is not None:

            profile, created = UserProfile.objects.get_or_create(user=user)

            if not profile.is_pharmacy_active:

                messages.error(

                    request,

                    "Your pharmacy account has been deactivated. Please contact VerifyBag."

                )

                return redirect("login")

            auth_login(request, user)

            next_url = request.GET.get("next")

            if next_url:

                return redirect(next_url)

            return redirect("dashboard")

        else:

            messages.error(
                request,
                "Invalid email or password."
            )

    return render(request, "login.html")

def forgot_password(request):

    return render(request, "forgot_password.html")


def register(request):

    if request.method == "POST":

        form = RegisterForm(request.POST)

        print(form.errors)

        if form.is_valid():

            user = User.objects.create_user(

                username=form.cleaned_data["email"],

                first_name=form.cleaned_data["first_name"],

                email=form.cleaned_data["email"],

                password=form.cleaned_data["password"]

            )

            UserProfile.objects.create(

                user=user
            )

            send_mail(
                "🎉 Welcome to VerifyBag",
                f"""
            Hi {user.first_name},

            Welcome to VerifyBag!

            Your pharmacy account has been created successfully.

            Please complete your pharmacy profile so our administrators can review and approve your pharmacy.

            Thank you for helping fight counterfeit drugs in Nigeria.

            The VerifyBag Team
            """,
                settings.DEFAULT_FROM_EMAIL,
                [user.email],
                fail_silently=True,
            )

            messages.success(

                request,

                "Account created successfully."

            )
            auth_login(request, user)
            return redirect("profile")

    else:

        form = RegisterForm()

    return render(

        request,

        "register.html",

        {

            "form": form

        }

    )

@login_required(login_url="login")
def verify_drug(request):

    verification = None
    approved = None
    detected_nafdac = ""
    show_report = False

    recent_verifications = DrugVerification.objects.filter(
        user=request.user
    ).order_by("-created_at")[:5]

    if request.method == "POST":

        image = request.FILES.get("drug_image")
        manual_nafdac = request.POST.get("nafdac_number")

        if not image and not manual_nafdac:

            messages.error(
                request,
                "Please upload a medicine image or enter a NAFDAC number."
            )

            recent_verifications = DrugVerification.objects.filter(
                user=request.user
            ).order_by("-created_at")[:5]

            return render(
                request,
                "verify_drug.html",
                {
                    "verification": None,
                    "approved": None,
                    "detected_nafdac": "",
                    "show_report": False,
                    "recent_verifications": recent_verifications,
                }
            )

        if image:

            img = Image.open(image)

            extracted_text = pytesseract.image_to_string(img)

            print(extracted_text)

            match = re.search(
                r"[A-Z]\d-\d{4}",
                extracted_text.upper()
            )

            if match:

                detected_nafdac = match.group()

            image.seek(0)

        nafdac = manual_nafdac or detected_nafdac

        approved = ApprovedDrug.objects.filter(
            nafdac_number=nafdac,
            is_active=True
        ).first()

        if approved:
            result = "Authentic"
        else:
            result = "Counterfeit / Not Found"

        verification = DrugVerification.objects.create(
            user=request.user,
            drug_image=image,
            nafdac_number=nafdac,
            result=result
        )

        show_report = result == "Counterfeit / Not Found"

    return render(
        request,
        "verify_drug.html",
        {
            "verification": verification,
            "approved": approved,
            "detected_nafdac": detected_nafdac,
            "show_report": show_report,
            "recent_verifications": recent_verifications,
        }
    )



@login_required(login_url="login")
def ocr_scan(request):

    if request.method == "POST":

        image = request.FILES.get("drug_image")

        detected = ""

        if image:

            img = Image.open(image)

            text = pytesseract.image_to_string(img)

            print("========== OCR TEXT =========")
            print(text)
            print("==============================")

            match = re.search(
                r"[A-Z]\d-\d{4}",
                text.upper()
            )

            if match:

                detected = match.group()

        return JsonResponse({

            "nafdac_number": detected

        })

    return JsonResponse({

        "nafdac_number": ""

    })

@login_required(login_url="login")
def verification_history(request):

    verifications = DrugVerification.objects.filter(
        user=request.user
    ).order_by("-created_at")

    return render(
        request,
        "verification_history.html",
        {
            "verifications": verifications
        }
    )

@login_required(login_url="login")
def delete_verification(request, id):

    verification = get_object_or_404(
        DrugVerification,
        id=id,
        user=request.user
    )

    if verification.drug_image:
        verification.drug_image.delete(save=False)

    verification.delete()

    messages.success(
        request,
        "Verification deleted successfully."
    )

    return redirect("verification_history")

@login_required(login_url="login")
def report_fake_drug(request, id):

    verification = get_object_or_404(
        DrugVerification,
        id=id,
        user=request.user
    )

    if request.method == "POST":

        report = FakeDrugReport.objects.create(

            user=request.user,

            verification=verification,

            pharmacy_name=request.POST.get("pharmacy_name"),

            state=request.POST.get("state"),

            reason=request.POST.get("reason")

        )

        report_id = f"VB-{report.created_at.year}-{report.id:06d}"

        return render(

            request,

            "report_success.html",

            {

                "report_id": report_id

            }

        )

    return redirect("verification_history")

@login_required(login_url="login")
def dashboard(request):

    total_verifications = DrugVerification.objects.filter(
        user=request.user
    ).count()

    authentic = DrugVerification.objects.filter(
        user=request.user,
        result="Authentic"
    ).count()

    counterfeit = DrugVerification.objects.filter(
        user=request.user,
        result="Counterfeit / Not Found"
    ).count()

    reports = FakeDrugReport.objects.filter(
        user=request.user
    ).count()

    # Success Rate
    success_rate = 0

    if total_verifications > 0:

        success_rate = round(
            (authentic / total_verifications) * 100
        )

    # Today's Activity
    from django.utils import timezone

    today_total = DrugVerification.objects.filter(
        user=request.user,
        created_at__date=timezone.now().date()
    ).count()

    recent = DrugVerification.objects.filter(
        user=request.user
    ).order_by("-created_at")[:5]

    monthly = (
        DrugVerification.objects.filter(user=request.user)
        .annotate(month=TruncMonth("created_at"))
        .values("month")
        .annotate(total=Count("id"))
        .order_by("month")
    )

    states = (
        FakeDrugReport.objects.filter(user=request.user)
        .values("state")
        .annotate(total=Count("id"))
        .order_by("-total")
    )

    months = []
    monthly_totals = []

    for item in monthly:

        months.append(item["month"].strftime("%b"))
        monthly_totals.append(item["total"])

    state_names = []
    state_totals = []

    for item in states:

        state_names.append(item["state"])
        state_totals.append(item["total"])

    context = {

        "total": total_verifications,

        "authentic": authentic,

        "counterfeit": counterfeit,

        "reports": reports,

        "recent": recent,

        "months": months,

        "monthly_totals": monthly_totals,

        "state_names": state_names,

        "state_totals": state_totals,

        "success_rate": success_rate,

        "today_total": today_total,

    }

    return render(
        request,
        "dashboard.html",
        context
    )

@login_required(login_url="login")
def profile(request):

    profile, created = UserProfile.objects.get_or_create(

        user=request.user

    )

    if request.method == "POST":

        profile.pharmacy_name = request.POST.get("pharmacy_name")

        profile.phone = request.POST.get("phone")

        profile.state = request.POST.get("state")

        profile.pharmacy_license = request.POST.get("pharmacy_license")

        if request.FILES.get("profile_picture"):

            profile.profile_picture = request.FILES.get(

                "profile_picture"

            )

        profile.save()

        messages.success(

            request,

            "Profile updated successfully."

        )

        return redirect("dashboard")

    return render(

        request,

        "profile.html",

        {

            "profile": profile

        }

    )

def logout_view(request):
    logout(request)
    return redirect('home')

def about(request):
    return render(request, "about.html")

def features(request):
    return render(request, "features.html")

def pricing(request):
    return render(request, "pricing.html")

def contact(request):

    if request.method == "POST":

        name = request.POST.get("name")

        email = request.POST.get("email")

        subject = request.POST.get("subject")

        message = request.POST.get("message")

        send_mail(

            f"VerifyBag Contact Form: {subject}",

            f"""
New Contact Message

Name:
{name}

Email:
{email}

Subject:
{subject}

Message:

{message}
""",

            settings.DEFAULT_FROM_EMAIL,

            ["verifybagteam@gmail.com"],

            fail_silently=True,

        )

        messages.success(

            request,

            "Your message has been sent successfully. We'll get back to you soon."

        )

        return redirect("contact")

    return render(

        request,

        "contact.html"

    )

def custom_404(request, exception):

    return render(request, "404.html", status=404)


def custom_500(request):

    return render(request, "500.html", status=500)