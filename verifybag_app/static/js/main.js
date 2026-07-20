const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

if (hamburger) {

    hamburger.addEventListener("click", () => {

        hamburger.classList.toggle("active");

        navLinks.classList.toggle("active");

    });

    document.querySelectorAll("#mobile-menu a").forEach(link => {

        link.addEventListener("click", () => {

            hamburger.classList.remove("active");

            navLinks.classList.remove("active");

        });

    });

}

/*===========================
SCROLL TO TOP
===========================*/

const scrollBtn = document.getElementById("scrollTopBtn");

window.addEventListener("scroll", () => {

    if(window.scrollY > 300){

        scrollBtn.classList.add("show");

    }

    else{

        scrollBtn.classList.remove("show");

    }

});

scrollBtn.addEventListener("click", () => {

    window.scrollTo({

        top:0,

        behavior:"smooth"

    });

});

// ==========================================
// VERIFYBAG AUTO ANIMATION ENGINE
// ==========================================

// Elements that should animate automatically
const elements = document.querySelectorAll(`
section,
.profile-card,
.verify-card,
.result-card,
.recent-card,
.report-card,
.chart-card,
.stat-card,
.upload-box,
.problem-card,
.feature-card,
.pricing-card,
.contact-card,
.about-card,
.card,
footer
`);

elements.forEach((element, index) => {

    element.classList.add("vb-hidden");

    // automatic stagger delay
    element.style.transitionDelay = `${(index % 6) * 0.12}s`;

});

const observer = new IntersectionObserver(

(entries)=>{

entries.forEach(entry=>{

if(entry.isIntersecting){

entry.target.classList.add("vb-show");

}else{

entry.target.classList.remove("vb-show");

}

});

},

{

threshold:0.15

}

);

elements.forEach(element=>{

observer.observe(element);

});

// ==========================================
// NAVBAR SHRINK
// ==========================================

const navbar = document.querySelector(".navbar");

window.addEventListener("scroll", ()=>{

    if(window.scrollY > 60){

        navbar.classList.add("shrink");

    }else{

        navbar.classList.remove("shrink");

    }

});

// ==========================================
// ANIMATED COUNTERS
// ==========================================

const counters = document.querySelectorAll(".counter");

const counterObserver = new IntersectionObserver((entries)=>{

    entries.forEach(entry=>{

        if(entry.isIntersecting){

            const counter = entry.target;

            const target = Number(counter.dataset.target);

            let current = 0;

            const increment = Math.max(target / 80, 1);

            function updateCounter(){

                current += increment;

                if(current < target){

                    counter.innerText = Math.floor(current).toLocaleString();

                    requestAnimationFrame(updateCounter);

                }else{

                    counter.innerText = target.toLocaleString();

                }

            }

            updateCounter();

            counterObserver.unobserve(counter);

        }

    });

},{threshold:.4});

counters.forEach(counter=>{

    counterObserver.observe(counter);

});

// ==========================================
// RIPPLE BUTTON EFFECT
// ==========================================

const rippleButtons = document.querySelectorAll(

".login-btn,.register-btn,button"

);

rippleButtons.forEach(button=>{

    button.addEventListener("click",function(e){

        const ripple=document.createElement("span");

        const rect=this.getBoundingClientRect();

        const size=Math.max(rect.width,rect.height);

        ripple.style.width=size+"px";

        ripple.style.height=size+"px";

        ripple.style.left=(e.clientX-rect.left-size/2)+"px";

        ripple.style.top=(e.clientY-rect.top-size/2)+"px";

        ripple.classList.add("ripple");

        this.appendChild(ripple);

        ripple.addEventListener("animationend",()=>{

            ripple.remove();

        });

    });

});

window.addEventListener("load", () => {

    const loader = document.getElementById("loader");

    const navigation =
        performance.getEntriesByType("navigation")[0];

    if (navigation && navigation.type === "reload") {

        setTimeout(() => {

            loader.style.opacity = "0";

            setTimeout(() => {

                loader.style.display = "none";

            }, 600);

        }, 500);

    } else {

        loader.style.display = "none";

    }

});