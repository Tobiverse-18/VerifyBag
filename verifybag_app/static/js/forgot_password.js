/* ==========================================
   FORGOT PASSWORD
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* PAGE ANIMATION */

    const container = document.querySelector(".forgot-container");

    container.style.opacity = "0";
    container.style.transform = "translateY(40px)";

    setTimeout(() => {

        container.style.transition = "all .8s ease";

        container.style.opacity = "1";

        container.style.transform = "translateY(0)";

    }, 100);

});


/* ==========================================
   EMAIL VALIDATION
========================================== */

const form = document.querySelector("form");

const button = document.querySelector(".forgot-btn");

form.addEventListener("submit", function(e){

    e.preventDefault();

    const email = form.email.value.trim();

    if(email === ""){

        alert("Please enter your email address.");

        return;

    }

    button.disabled = true;

    button.innerHTML = "Sending Reset Link...";

    setTimeout(function(){

        button.innerHTML = "✔ Email Sent";

        button.style.background = "#22c55e";

    },2000);

});


/* ==========================================
   INPUT ANIMATION
========================================== */

const inputs = document.querySelectorAll("input");

inputs.forEach(function(input){

    input.addEventListener("focus", function(){

        input.parentElement.style.transform = "translateY(-4px)";

        input.parentElement.style.transition = ".3s";

    });

    input.addEventListener("blur", function(){

        input.parentElement.style.transform = "translateY(0)";

    });

});