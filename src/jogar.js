import stages from "../data/stages.js";

const stagesEl = document.getElementById("stages");
const gameEl = document.getElementById("game");

function makeQuiz(stage) {
    const container = document.createElement("div");
    const enunciate = document.createElement("h3");
    enunciate.innerHTML = `<span class="mark">1.</span> ${stage.questions["1"].question}`;

    container.appendChild(enunciate);

    return container;
}

function loadStage(stageIndex) {
    if (!stages[stageIndex]) {
        return null;
    }

    stagesEl.style.display = "none";
    gameEl.innerHTML = `<h1 class="anim-slide-fade">PREPARE-SE!</h1>`;

    setTimeout(() => {
        gameEl.innerHTML = "";
        gameEl.appendChild(makeQuiz(stages[stageIndex]));
    }, 2000)
}

function buildStages() {
    stages.forEach((stage, index) => {
        const card = document.createElement("div");
        card.className = "column card anim-slide-fade";
        card.innerHTML = `
            <i class="s-5 thin center mv-1">${stage.icon}</i>
            <h3 class="center">${stage.title}</h3>
            <p class="center">${stage.description}</p>
        `;

        card.addEventListener("click", () => {
            loadStage(index);
        });

        stagesEl.appendChild(card)
    });
}

buildStages();
