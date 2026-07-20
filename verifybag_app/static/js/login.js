/* ==========================================
   VERIFYBAG LOGIN PAGE
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    const form = document.querySelector("form");

    const button = document.querySelector(".login-btn");

    const password = document.getElementById("password");

    const toggle = document.getElementById("togglePassword");


    /* ==========================================
       PAGE ANIMATION
    ========================================== */

    const card = document.querySelector(".login-card");

    card.style.opacity = "0";

    card.style.transform = "translateY(30px)";

    setTimeout(() => {

        card.style.transition = ".7s ease";

        card.style.opacity = "1";

        card.style.transform = "translateY(0)";

    },100);


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
       LOGIN BUTTON
    ========================================== */

    form.addEventListener("submit", () => {

        button.disabled = true;

        button.innerHTML = "Signing In...";

    });

});