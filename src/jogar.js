import stages from "../data/stages.js";
import utils from "./utils.js";

const stagesEl = document.getElementById("stages");
const gameEl = document.getElementById("game");
const pointsEl = document.getElementById("points");
const finishEl = document.getElementById("finish");
const resetEl = document.getElementById("reset");

const K_STAGES = "stages";
const K_FINISHED = "finished";

if (!localStorage.getItem(K_STAGES)) {
  const obj = {};
  Object.keys(stages).forEach((key) => obj[key] = []);
  localStorage.setItem(K_STAGES, JSON.stringify(obj));
}

let pointsCounter = 0;

function verifyComplete(key) {
  return JSON.parse(localStorage.getItem(K_STAGES))[key].length
    == Object.keys(stages[key]["questions"]).length
}

function setFinished() {
  return localStorage.setItem(K_FINISHED, String('true'))
}

function getFinished() {
  return localStorage.getItem(K_FINISHED)
}

function makeQuiz(stageKey) {
  const stage = stages[stageKey];
  const questions = stage["questions"];
  const quizContainer = document.createElement("div");

  quizContainer.className = "quiz";

  Object.keys(questions).forEach((key) => {
    if (!JSON.parse(localStorage.getItem(K_STAGES))[stageKey].includes(key)) {
      const container = document.createElement("div");
      container.className = "question";
      container.id = `question-${key}`;

      const question = questions[key];

      const progress = document.createElement("p");
      progress.className = "progress";
      progress.textContent = `${key}/${Object.keys(questions)[Object.keys(questions).length - 1]}`;


      const image = document.createElement("img");

      image.className = "image";
      image.src = question.image || "";


      if (question["image_desc"]) {
        image.alt = question["image_desc"]
      }

      const credits = document.createElement("p");

      credits.className = "credits";
      credits.textContent = "Créditos: " + question["credits"] || "";

      const enunciate = document.createElement("h3");
      enunciate.className = "enunciate text-center mv-2"
      enunciate.innerHTML = `<span class="mark">${key}.</span> ${question["question"]}`;

      const form = document.createElement("form");
      form.className = "form";

      const options = document.createElement("div");
      options.className = "options mv-2 gap-2";

      let lastOption = null;

      Object.keys(question["options"]).forEach((letter) => {
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
        optionLabel.textContent = question["options"][letter];
        optionLabel.className = "option-label";

        optionInput.addEventListener("change", () => {
          utils.playAudio('btn')
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
      panel.className = "alert-panel mv-2";

      const btnContainer = document.createElement("div");
      btnContainer.className = "row autow gap-2";

      const back = document.createElement("button");
      back.type = "button";
      back.className = "primary-out autow";
      back.textContent = "Voltar";

      back.addEventListener("click", () => {
        utils.playAudio('btn');
        gameEl.classList.add("disabled");
        stagesEl.classList.remove("disabled");
      });

      const submit = document.createElement("button");
      submit.type = "submit";
      submit.className = "secondary autow";
      submit.textContent = "Responder";

      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const answer = (new FormData(event.target)).get("answer");
        if (!answer) {
          utils.alert(panel, "Selecione uma alternativa!", "error");
          utils.playAudio('error');
          return;
        }
        if (answer === question.answer) {
          utils.alert(panel, "Parabéns! Você Acertou!", "success");
          utils.playAudio('success');
          utils.storeCorrect(stageKey, key);
        } else {
          utils.alert(panel, "Resposta errada!", "error");
          utils.playAudio('error');
        }

        setTimeout(() => {
          container.remove();
          if (quizContainer.children.length == 0) {
            window.location.reload();
          }
        }, 2000);
      })

      btnContainer.appendChild(back);
      btnContainer.appendChild(submit);

      form.appendChild(options);
      form.append(panel);
      form.append(btnContainer)

      container.appendChild(progress);

      if (question["image"]) {
        container.appendChild(image);
      }

      if (question["credits"]) {
        container.appendChild(credits);
      }

      container.appendChild(enunciate);
      container.appendChild(form);

      quizContainer.appendChild(container);
    }
  });

  return quizContainer;
}

function loadStage(stageKey) {
  if (!stages[stageKey]) {
    return;
  }

  gameEl.classList.remove("disabled");
  stagesEl.classList.add("disabled");

  gameEl.innerHTML = `<h1 class="anim-slide-fade text-primary neon">PREPARE-SE!</h1>`;

  setTimeout(() => {
    gameEl.innerHTML = "";
    gameEl.appendChild(makeQuiz(stageKey));
  }, 2000)
}

function buildStages() {
  Object.keys(stages).forEach((key) => {
    const stage = stages[key];
    const card = document.createElement("div");
    card.id = `stage-${key}`;
    card.className = "column card anim-slide-fade";
    card.innerHTML = `
            <i class="s-5 thin center mv-1">${stage.icon}</i>
            <h3 class="center text-center">${stage.title}</h3>
            <p class="center text-center">${stage.description}</p>
        `;

    card.addEventListener("click", () => {
      loadStage(key);
      utils.playAudio('btn');
    });

    if (verifyComplete(key)) {
      card.classList.add("completed");
      pointsCounter++;
    }

    const quantity = Object.keys(JSON.parse(localStorage.getItem(K_STAGES))).length;

    pointsEl.textContent = `${pointsCounter}/${quantity}`;

    if (pointsCounter == quantity) {
      finishEl.classList.add("visible");
      if (!getFinished()) {
        utils.playAudio('finish')
        setFinished()
      }
      resetEl.addEventListener("click", () => {
        utils.playAudio('btn');
        localStorage.removeItem(K_STAGES);
        localStorage.removeItem(K_FINISHED);
        window.location.reload();
      });
    }

    stagesEl.appendChild(card);
  });
}

buildStages();
