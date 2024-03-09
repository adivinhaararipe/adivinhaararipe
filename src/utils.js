class Utils {
    constructor() {
        this.lockAlert = false;
    }

    alert(panelElement, text, status) {
        if (!this.lockAlert) {
            this.lockAlert = true;
            panelElement.textContent = text;
            panelElement.classList.add("active", status);

            setTimeout(() => {
                this.lockAlert = false;
                panelElement.classList.remove("active", status);
            }, 3000);
        }
    }

    storeCorrect(stage, question) {
        const stageStatus = JSON.parse(localStorage.getItem("stages"));
        if (!stageStatus[stage]) return;
        if (stageStatus[stage].includes(question)) return;

        stageStatus[stage].push(question);

        localStorage.setItem("stages",
            JSON.stringify(stageStatus));
    }

    playAudio(variant) {
        switch (variant) {
            case 'success':
                new Audio('static/audio/success.mpeg').play();
                break;
            case 'error':
                new Audio('static/audio/error.mpeg').play();
                break;
            case 'btn':
                new Audio('static/audio/btn.mpeg').play();
                break;
            case 'finish':
                new Audio('static/audio/finish.mpeg').play();
                break;
        }
    }
}

export default new Utils;