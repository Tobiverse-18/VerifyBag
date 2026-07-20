/* ==========================================
   VERIFYBAG REGISTER PAGE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");

    const button = document.querySelector(".register-btn");

    const password = document.getElementById("password");

    const toggle = document.getElementById("togglePassword");

    const strengthFill = document.getElementById("strengthFill");

    const strengthText = document.getElementById("strengthText");


    /* ==========================================
       SHOW / HIDE PASSWORD
    ========================================== */

    toggle.addEventListener("click", () => {

        if(password.type === "password"){

            password.type = "text";

            toggle.innerHTML = "🙈";

        }

        else{

            password.type = "password";

            toggle.innerHTML = "👁";

        }

    });


    /* ==========================================
       PASSWORD STRENGTH
    ========================================== */

    password.addEventListener("input", () => {

        const value = password.value;

        let score = 0;

        if(value.length >= 8) score++;

        if(/[A-Z]/.test(value)) score++;

        if(/[0-9]/.test(value)) score++;

        if(/[!@#$%^&*(),.?":{}|<>]/.test(value)) score++;

        switch(score){

            case 0:

                strengthFill.style.width = "0%";

                strengthFill.style.background = "#ef4444";

                strengthText.textContent = "Password Strength";

                break;

            case 1:

                strengthFill.style.width = "25%";

                strengthFill.style.background = "#ef4444";

                strengthText.textContent = "Weak";

                break;

            case 2:

                strengthFill.style.width = "50%";

                strengthFill.style.background = "#f59e0b";

                strengthText.textContent = "Fair";

                break;

            case 3:

                strengthFill.style.width = "75%";

                strengthFill.style.background = "#3b82f6";

                strengthText.textContent = "Good";

                break;

            case 4:

                strengthFill.style.width = "100%";

                strengthFill.style.background = "#22c55e";

                strengthText.textContent = "Strong";

                break;

        }

    });


    /* ==========================================
       INPUT ANIMATION
    ========================================== */

    document.querySelectorAll("input").forEach(input => {

        input.addEventListener("focus", () => {

            input.style.transform = "scale(1.02)";

        });

        input.addEventListener("blur", () => {

            input.style.transform = "scale(1)";

        });

    });


    /* ==========================================
       BUTTON LOADING
    ========================================== */

    form.addEventListener("submit", () => {

        button.disabled = true;

        button.innerHTML = "Creating Account...";

    });

});