document.addEventListener("DOMContentLoaded", () => {

    const button = document.getElementById("themeToggle");

    if(localStorage.getItem("theme") === "dark"){

        document.body.classList.add("dark");

        button.textContent="☀";

    }

    button.addEventListener("click",()=>{

        document.body.classList.toggle("dark");

        if(document.body.classList.contains("dark")){

            localStorage.setItem("theme","dark");

            button.textContent="☀";

        }

        else{

            localStorage.setItem("theme","light");

            button.textContent="🌙";

        }

    });

});