import stages from "../data/stages.js";
import utils from "./utils.js";

const stagesEl = document.getElementById("stages");
const gameEl = document.getElementById("game");

if (!localStorage.getItem("stages")) {
    const obj = {};
    Object.keys(stages).forEach((key) => {
        obj[key] = [];
    })

    localStorage.setItem("stages", JSON.stringify(obj));
}

function makeQuiz(stage) {
    const container = document.createElement("div");
    container.className = "quiz";

    const image = document.createElement("img");
    if (stage.questions["1"].image) {
        image.className = "image anim-slide-fade";
        image.alt = stage.questions["1"]["image_desc"]
        image.src = stage.questions["1"].image;
    }
    
    const enunciate = document.createElement("h3");
    enunciate.className = "enunciate text-center mv-2"
    enunciate.innerHTML = `<span class="mark">1.</span> ${stage.questions["1"].question}`;

    const form = document.createElement("form");
    form.className = "form";

    const options = document.createElement("div");
    options.className = "options mv-2 gap-2";

    let lastOption = null;

    Object.keys(stage.questions["1"].options).forEach((letter) => {
        const optionContainer = document.createElement("div");
        optionContainer.className = "option";

        const optionInput = document.createElement("input");
        optionInput.value = letter;
        optionInput.className = "option-input"
        optionInput.type = "radio";
        optionInput.name = "answer";
        optionInput.id = letter;

        if (optionInput.checked) {
            optionContainer.classList.add("selected");
        }

        const optionLabel = document.createElement("label");
        optionLabel.setAttribute("for", letter);
        optionLabel.textContent = stage.questions["1"].options[letter];
        optionLabel.className = "option-label";

        optionInput.addEventListener("change", () => {
            if (lastOption != null) {
                lastOption.classList.remove("selected");
            }
            optionContainer.classList.add("selected");
            lastOption = optionContainer;
        });


        optionContainer.appendChild(optionInput);
        optionContainer.appendChild(optionLabel);

        options.appendChild(optionContainer);
    });

    const panel = document.createElement("p");
    panel.className = "alert-panel";

    const btnContainer = document.createElement("div");
    btnContainer.className = "row autow gap-2 mv-2";

    const back = document.createElement("button");
    back.type = "button";
    back.className = "primary-out autow";
    back.textContent = "Voltar";

    const submit = document.createElement("button");
    submit.type = "submit";
    submit.className = "secondary autow";
    submit.textContent = "Enviar";

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        const answer = (new FormData(event.target)).get("answer");
        if (!answer) {
            utils.alert(panel, "Selecione uma alternativa!", "error");
            return;
        }
        if (answer === stage.questions["1"].answer) {
            utils.alert(panel, "Parabéns! Você Acertou!", "success");
            utils.storeCorrect("arquitetura", "1")
        } else {
            utils.alert(panel, "Resposta errada!", "error");
            return;
        }
    })

    btnContainer.appendChild(back);
    btnContainer.appendChild(submit);

    form.appendChild(options);
    form.append(panel);
    form.append(btnContainer)

    if (image.hasAttribute("src")) {
        container.appendChild(image);
    }

    container.appendChild(enunciate);
    container.appendChild(form);

    return container;
}

function loadStage(stageKey) {
    if (!stages[stageKey]) {
        return null;
    }

    stagesEl.style.display = "none";
    gameEl.innerHTML = `<h1 class="anim-slide-fade">PREPARE-SE!</h1>`;

    setTimeout(() => {
        gameEl.innerHTML = "";
        gameEl.appendChild(makeQuiz(stages[stageKey]));
    }, 2000)
}

function buildStages() {
    Object.keys(stages).forEach((key) => {
        const stage = stages[key];
        const card = document.createElement("div");
        card.className = "column card anim-slide-fade";
        card.innerHTML = `
            <i class="s-5 thin center mv-1">${stage.icon}</i>
            <h3 class="center text-center">${stage.title}</h3>
            <p class="center text-center">${stage.description}</p>
        `;

        card.addEventListener("click", () => {
            loadStage(key);
        });

        stagesEl.appendChild(card);
    });
}

buildStages();
loadStage(0)