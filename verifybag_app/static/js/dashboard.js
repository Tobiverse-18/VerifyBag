document.addEventListener("DOMContentLoaded", () => {

    /* ===============================
       CARD ANIMATION
    =============================== */

    document.querySelectorAll(".stat-card,.chart-card,.recent-card")
    .forEach((card,index)=>{

        card.style.opacity="0";
        card.style.transform="translateY(30px)";

        setTimeout(()=>{

            card.style.transition=".6s ease";

            card.style.opacity="1";

            card.style.transform="translateY(0)";

        },index*180);

    });

    /* ===============================
       COUNT UP ANIMATION
    =============================== */

    document.querySelectorAll(".stat-card h2")
    .forEach(counter=>{

        const target=parseInt(counter.innerText);

        let count=0;

        const speed=Math.max(1,Math.ceil(target/40));

        const timer=setInterval(()=>{

            count+=speed;

            if(count>=target){

                counter.innerText=target;

                clearInterval(timer);

            }

            else{

                counter.innerText=count;

            }

        },30);

    });

    /* ===============================
       MONTHLY LINE CHART
    =============================== */

    new Chart(

        document.getElementById("monthlyChart"),

        {

            type:"line",

            data:{

                labels:months,

                datasets:[{

                    label:"Verifications",

                    data:monthlyTotals,

                    borderColor:"#2563eb",

                    backgroundColor:"rgba(37,99,235,.15)",

                    borderWidth:4,

                    fill:true,

                    tension:.35

                }]

            },

            options:{

                responsive:true,

                plugins:{

                    legend:{

                        display:false

                    }

                }

            }

        }

    );

    /* ===============================
       PIE CHART
    =============================== */

    new Chart(

        document.getElementById("pieChart"),

        {

            type:"pie",

            data:{

                labels:[

                    "Authentic",

                    "Counterfeit"

                ],

                datasets:[{

                    data:[

                        authentic,

                        counterfeit

                    ],

                    backgroundColor:[

                        "#22c55e",

                        "#ef4444"

                    ]

                }]

            }

        }

    );

});

/* ===============================
   REPORTS BY STATE
=============================== */

new Chart(

    document.getElementById("stateChart"),

    {

        type:"bar",

        data:{

            labels:states,

            datasets:[{

                label:"Reports",

                data:stateTotals,

                backgroundColor:"#2563eb"

            }]

        },

        options:{

            responsive:true,

            plugins:{

                legend:{

                    display:false

                }

            }

        }

    }

);