const track = document.getElementById("logoTrack");

if (track) {

    let scrollPosition = 0;
    let speed = 1;

    function slideLogos() {

        scrollPosition += speed;

        track.style.transform = `translateX(-${scrollPosition}px)`;

        if (scrollPosition >= track.scrollWidth / 2) {
            scrollPosition = 0;
        }

        requestAnimationFrame(slideLogos);
    }

    slideLogos();

    track.addEventListener("mouseenter", () => {
        speed = 0;
    });

    track.addEventListener("mouseleave", () => {
        speed = 1;
    });

}

/* ==========================================
   FAQ ACCORDION
========================================== */

const faqItems = document.querySelectorAll(".faq-item");

faqItems.forEach(item => {

    const button = item.querySelector(".faq-question");

    button.addEventListener("click", () => {

        faqItems.forEach(faq => {

            if(faq !== item){

                faq.classList.remove("active");

            }

        });

        item.classList.toggle("active");

    });

});

