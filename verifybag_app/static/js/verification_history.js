/* ==========================================
   VERIFYBAG - VERIFICATION HISTORY
========================================== */

document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       PAGE FADE-IN ANIMATION
    =============================== */

    const items = document.querySelectorAll(".history-item");

    items.forEach((item, index) => {

        item.style.opacity = "0";
        item.style.transform = "translateY(25px)";

        setTimeout(() => {

            item.style.transition = ".5s ease";

            item.style.opacity = "1";
            item.style.transform = "translateY(0)";

        }, index * 120);

    });

    /* ===============================
       LIVE SEARCH
    =============================== */

    const searchInput = document.getElementById("historySearch");

    searchInput.addEventListener("keyup", () => {

        const value = searchInput.value.toLowerCase();

        document.querySelectorAll(".history-item").forEach(item => {

            const text = item.innerText.toLowerCase();

            if (text.includes(value)) {

                item.style.display = "flex";

            } else {

                item.style.display = "none";

            }

        });

    });

});