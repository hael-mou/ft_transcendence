import avatarsComponent from "./avatarsContainerComponent.js";
import { Router } from "../../core/routing.js";
import { Auth } from "../../tools/http.js";

const style = `<style>
* {
    padding: 0;
    margin: 0;
}

body {
    width: 100vw;
    height: 100vh;
}

#matchMakingContainer {
    width: 100%;
    height: 99.8%;
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    background: rgba(44 44 44 / 60%);
    backdrop-filter: blur( 4px );
    -webkit-backdrop-filter: blur( 4px );
    border-radius: 10px;
    color: #F0F8FF;
}

#matchMakingContainer > * {
    width: 100%;
    /* height: 20%; */
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    margin: 1rem auto;
}

#optionsHeader {
    text-align: center;
    width: 100%;
}

.colorButton {
    width: 3rem;
    height: 3rem;
    margin-right: 0.4rem;
    margin-top: 0.8rem;
    transition: 0.2s ease-in-out;
}

.colorButton {
    border: none;
    outline: none;
    border-radius: 50%;
    cursor: pointer;
}

#blue {
    background-color: #1E90FF;
}

#orange {
    background-color: #FF4500;
}

#green {
    background-color: #32CD32;
}

#gold {
    background-color: #FFD700;
}

#aiOptions {
    text-align: center;
    width: 100%;
    display: none;
}

.aiOptionsVisible {
    display: block !important;
}

.aiOptionButton {
    min-width: 5rem;
    height: 3rem;
    border-radius: 0.2rem;
    margin-right: 0.4rem;
    margin-top: 0.8rem;
    transition: 0.2s ease-in-out;
    border: none;
    outline: none;
    cursor: pointer;
    background: rgba( 255, 255, 255, 0.25 );
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
    backdrop-filter: blur( 4px );
    -webkit-backdrop-filter: blur( 4px );
    border-radius: 10px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
    color: white;
}

#startGame {
    width: 50%;
    height: 4rem;
    cursor: pointer;
    background: rgba( 255, 255, 255, 0.25 );
    box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
    backdrop-filter: blur( 4px );
    -webkit-backdrop-filter: blur( 4px );
    border-radius: 10px;
    border: 1px solid rgba( 255, 255, 255, 0.18 );
    color: #F0F8FF ;
    opacity: 0.2;
}

.colorButton:hover , .aiOptionButton:hover {
    transform: scale(1.01);
    box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

@media only screen and (max-width: 600px) {
    #matchMakingContainer > * {
        margin: 0.5rem auto;
    }

    .colorButton {
        width: 2.5rem;
        height: 2.5rem;
    }

    .aiOptionButton {
        min-width: 4rem;
        height: 2.5rem;
    }

    #startGame {
        height: 3rem;
    }

    #optionsHeader {
        font-size: 1.2rem;
    }

}

@media only screen and (max-width: 400px) {
    #matchMakingContainer > * {
        margin: 0.3rem auto;
    }

    .colorButton {
        width: 2rem;
        height: 2rem;
    }

    .aiOptionButton {
        min-width: 3rem;
        height: 2rem;
    }

    #startGame {
        height: 2.5rem;
    }

    #optionsHeader {
        font-size: 1rem;
    }
}

}
</style>`;

const template = `
${style}
<div id="matchMakingContainer">
    <avatars-component></avatars-component>
    <div id="aiOptions">
        <h3 id="optionsHeader" >Ai's difficulty</h3>
        <button class="aiOptionButton" value="easy" >Easy</button>
        <button class="aiOptionButton" value="normal" >Normal</button>
        <button class="aiOptionButton" value="impossible" >Impossible</button>
    </div>
    <div id="colorsOptions">
        <h3 id="optionsHeader">Game's color</h3>
        <button class="colorButton" id="blue" value="#1E90FF" ></button>
        <button class="colorButton" id="orange" value="#FF4500" ></button>
        <button class="colorButton" id="green" value="#32CD32" ></button>
        <button class="colorButton" id="gold" value="#FFD700" ></button>
    </div>
    <div>
        <button id="startGame" disabled>Start game</button>
    </div>
</div>`;



class matchMakinComponent extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({mode: "open"});
        this.mode = JSON.parse(localStorage.getItem("mode"));
        if (!this.mode) {
            Router.redirect('/game');
        }
        this.aiDifficulty = "normal";
        this.chosenColor = "1E90FF";
    }

    render () {
        this.shadowRoot.innerHTML = template;
        this.displayAiOptions();
    }

    displayAiOptions() {
        if (this.mode === "ai") {
            this.shadowRoot.querySelector("#aiOptions").classList.add('aiOptionsVisible');
        }
    }

    async connectedCallback () {
        this.render();
        this.pickAiDifficultyEvent();
        this.pickColorEvent();
        await this.matchMaking();
    }

    async matchMaking () {
        if (this.mode !== "multiplayer" && this.mode !== "tournament") {
            this.enableStartButton();
            await this.fetchAvatars();
            this.startButtonEvent();
        } else {
            const url = "wss://127.0.0.1:8080/matchmaking/ws/matchmaker/"
            const socket = new WebSocket(url + `?token=${await Auth.getAccessToken()}`);

            socket.onopen = () => {
                // change here to make a request with the id of the user
                console.log("[WS: ClientSocket]: open socket connection");
                socket.send(JSON.stringify({rank: "1"}));
            };

            socket.onmessage = async (event) => {
                console.log("[WS: ClientSocket]: data is recieved");
                const data = JSON.parse(event.data);
                localStorage.setItem("gameData", JSON.stringify({playerId: data.player_id, adversaryId: data.opponent_id, roomId: data.room_id}));
                this.enableStartButton();
                await this.fetchAvatars();
                this.startButtonEvent();
            };

            socket.onerror = () => {
                const custemAlert = document.createElement("custom-alert");
                custemAlert.setMessage("matchmaking is down currently, try again later!");
                custemAlert.modalInstance.show();
                Router.redirect('/game');
            }
        }
    };

    pickAiDifficultyEvent() {
        const aiOptionButton = this.shadowRoot.querySelectorAll(".aiOptionButton");
        for (let i = 0; i < aiOptionButton.length; i++) {
            aiOptionButton[i].addEventListener('click', (e) => {
                this.aiDifficulty = e.target.value.toLowerCase();
                this.updateAiAvatar();
                localStorage.setItem("aiDifficulty", JSON.stringify(this.aiDifficulty));
            })
        };
    }

    pickColorEvent() {
        const choiceButtons = this.shadowRoot.querySelectorAll(".colorButton");
        for (let i = 0; i < choiceButtons.length; i++) {
            choiceButtons[i].addEventListener('click', (e) => {
                this.chosenColor = e.target.value;
                localStorage.setItem("chosenColor", JSON.stringify(this.chosenColor));
            })
        };
    }

    startButtonEvent() {
        this.shadowRoot.querySelector("#startGame").addEventListener("click", (e) => {
            Router.redirect("/game/playing");
        });
    }

    enableStartButton() {
        this.shadowRoot.querySelector("#startGame").disabled = false;
        this.shadowRoot.querySelector("#startGame").style.opacity = "1";
    }

    initEventhandlers() {
        this.pickColorEvent();
        this.startButtonEvent();
    }

    async fetchAvatars() {
        // Set default avatar URLs
        const defaultAvatar = "/static/assets/imgs/avatar.png"; // get my profile picture
        let clientAvatar = defaultAvatar;
        let adversaryAvatar;

        // Determine avatars based on mode
        if (this.mode === "local") {
            adversaryAvatar = "/static/assets/imgs/avatar2.png";
        } else if (this.mode === "multiplayer" || this.mode === "tournament") {
            adversaryAvatar = null; // get my opponent's profile picture
        } else {
            adversaryAvatar = "/static/assets/imgs/normalAi.png";
        }

        // Update avatars in the UI
        this.shadowRoot.querySelector('avatars-component').setAvatarWithPosition(clientAvatar, "left");
        if (adversaryAvatar) {
            this.shadowRoot.querySelector('avatars-component').setAvatarWithPosition(adversaryAvatar, "right");
        }

        // Store avatar URLs in local storage
        localStorage.setItem("leftAvatar", JSON.stringify(clientAvatar));
        localStorage.setItem("rightAvatar", JSON.stringify(adversaryAvatar));
    }

    updateAiAvatar() {
        const avatarUrl = getAvatarUrlForAiDifficulty(this.aiDifficulty);
        this.shadowRoot.querySelector('avatars-component').setAvatarWithPosition(avatarUrl, "right");

        localStorage.setItem("rightAvatar", JSON.stringify(avatarUrl));
    }
};

function getAvatarUrlForAiDifficulty(aiDifficulty) {
    switch (aiDifficulty) {
        case "easy":
            return "/static/assets/imgs/easyAi.png";
        case "normal":
            return "/static/assets/imgs/normalAi.png";
        case "impossible":
            return "/static/assets/imgs/impossibleAi.png";
        default:
            throw new Error(`Unknown aiDifficulty: ${aiDifficulty}`);
    }
}

export default matchMakinComponent;
