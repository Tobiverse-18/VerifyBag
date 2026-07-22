document.addEventListener("DOMContentLoaded", () => {

    const uploadInput = document.getElementById("drugImage");
    const uploadContent = document.getElementById("uploadContent");

    const form = document.querySelector("form");
    const verifyButton = document.querySelector(".verify-btn");

    const overlay = document.getElementById("scannerOverlay");
    const status = document.getElementById("scanStatus");
    const progress = document.getElementById("progressFill");

    const nafdacInput = document.getElementById("nafdacNumber");

    // ===========================
    // PAGE ANIMATION
    // ===========================

    document.querySelectorAll(
        ".welcome-card,.verify-card,.result-card,.recent-card"
    ).forEach((card, index) => {

        card.style.opacity = "0";
        card.style.transform = "translateY(25px)";

        setTimeout(() => {

            card.style.transition = ".6s";

            card.style.opacity = "1";

            card.style.transform = "translateY(0)";

        }, index * 150);

    });

    // ===========================
    // IMAGE PREVIEW + AUTO OCR
    // ===========================

    uploadInput.addEventListener("change", function () {

        const file = this.files[0];

        if (!file) return;

        const reader = new FileReader();

        reader.onload = function (e) {

            uploadContent.innerHTML = `

                <img
                    src="${e.target.result}"
                    class="preview-image">

                <div class="image-ready">

                    ✅ Image Ready

                </div>

                <h3>${file.name}</h3>

                <p id="ocrStatus">

                    🔍 Detecting NAFDAC Number...

                </p>

                <button
                    type="button"
                    class="change-image">

                    Choose Another Image

                </button>

            `;

            document
                .querySelector(".change-image")
                .addEventListener("click", function () {

                    uploadInput.click();

                });

        };

        reader.readAsDataURL(file);

        // ===========================
        // AUTO OCR REQUEST
        // ===========================

        const formData = new FormData();

        formData.append("drug_image", file);

        fetch(OCR_SCAN_URL, {

            method: "POST",

            headers: {

                "X-CSRFToken": document.querySelector(
                    "[name=csrfmiddlewaretoken]"
                ).value

            },

            body: formData

        })

        .then(response => response.json())

        .then(data => {

            const statusText = document.getElementById("ocrStatus");

            if (data.nafdac_number) {

                nafdacInput.value = data.nafdac_number;

                if (statusText) {

                    statusText.innerHTML =
                        "✅ NAFDAC detected automatically";

                }

            }

            else {

                if (statusText) {

                    statusText.innerHTML =
                        "❌ No NAFDAC number detected";

                }

            }

        })

        .catch(() => {

            const statusText = document.getElementById("ocrStatus");

            if (statusText) {

                statusText.innerHTML =
                    "⚠ OCR Scan Failed";

            }

        });

    });

    // ===========================
    // VERIFY + OCR ANIMATION
    // ===========================

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const image = uploadInput.files[0];

        if (!image && nafdacInput.value.trim() === "") {

            alert(
                "Please upload a drug image or enter a NAFDAC number before verifying."
            );

            return;

        }

        overlay.style.display = "flex";

        verifyButton.disabled = true;

        const steps = [

            "Uploading Medicine...",

            "Analyzing Image...",

            "Reading Medicine Label...",

            "Detecting NAFDAC Number...",

            "Searching VerifyBag Database...",

            "Verification Complete ✅"

        ];

        let index = 0;

        let percent = 0;

        const timer = setInterval(() => {

            status.textContent = steps[index];

            percent += 20;

            progress.style.width = percent + "%";

            index++;

            if (index >= steps.length) {

                clearInterval(timer);

                setTimeout(() => {

                    form.submit();

                }, 700);

            }

        }, 600);

    });

});