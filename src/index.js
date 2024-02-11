import stages from "../data/stages.json" assert { type: "json" };


function buildStages() {
    stages.forEach((stage) => {
        document.getElementById("stages").innerHTML += `
            <div class="column card anim-slide-fade">
                <i class="s-5 thin center mv-1">${stage.icon}</i>
                <h3 class="center">${stage.title}</h3>
                <p class="center">${stage.description}</p>
            </div>
        `;
    });
}

buildStages();