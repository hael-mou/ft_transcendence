import Game from './entities/Game.js'
import loadingoverlay from './loadingOverlayComponent.js'
import avatarsComponent from './avatarsContainerComponent.js';
import { Alert } from '../custem-alert.js';
import { Router } from "../../core/routing.js";

const style = `<style>
* {
    padding: 0;
    margin: 0;
}

#gameContainer {
    min-height: 100%;
    min-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-wrap: wrap;
    flex-direction: column;
    background: linear-gradient(to right, rgba(56, 56, 56, 0.5) 3%, rgba(44, 44, 44, 0.5) 100%);
}

#canvas {
    /* From https://css.glass */
    background: rgba(255, 255, 255, 0.83);
    border-radius: 0.1rem;
    box-shadow: 0px 0px 20px 0px #2090ff;
    backdrop-filter: blur(16.6px);
    -webkit-backdrop-filter: blur(16.6px);
    border: 1px solid rgba(255, 255, 255, 0.3);
    height: 80%;
    width: 80%;
    border-radius: 20px;
}

#score {
    color: white;
    font-size: 1.8rem;
    margin: 1rem;
}

#homeButton {
    display: none;
    color: rgba(30, 143, 255, 0.4);
}

#infoSpan {
    display: none;
    text-align: center;
    color: white;
    margin: 1rem;
    font-size: 1.3rem;
    font-weight: 500;
}

.scored {
    // border: 1px rgba(55, 190, 172, 1) solid !important;
    // box-shadow: rgba(55, 190, 172, 0.3) 0px 0px 0px 3px !important;
    // box-shadow: rgba(255, 0, 0, 0.25) 0px 54px 55px, rgba(255, 0, 0, 0.12) 0px -12px 30px, rgba(255, 0, 0, 0.12) 0px 4px 6px, rgba(255, 0, 0, 0.17) 0px 12px 13px, rgba(255, 0, 0, 0.09) 0px -3px 5px;
}


.conceded {
    // border: 1px rgba(244, 86, 128, 1) solid !important;
    // box-shadow: rgba(244, 86, 128, 0.3) 0px 0px 0px 3px !important;
    // box-shadow: rgba(255, 0, 0, 0.25) 0px 54px 55px, rgba(255, 0, 0, 0.12) 0px -12px 30px, rgba(255, 0, 0, 0.12) 0px 4px 6px, rgba(255, 0, 0, 0.17) 0px 12px 13px, rgba(255, 0, 0, 0.09) 0px -3px 5px;
}
}

</style>`;

const template = `
    ${style}
    <div id="gameContainer">
        <loadingoverlay-component></loadingoverlay-component>
        <avatars-component></avatars-component>
        <div>
            <span id="infoSpan"></span>
        </div>
        <canvas id="canvas" width="1200px" height="600px"></canvas>
        <div>
            <anchorbutton-component id="homeButton" value="Return home" >hehe boy</anchorbutton-component>
        </div>
    </div>
`;



class gameComponent extends HTMLElement {
    constructor () {
        super();
        this.attachShadow({mode: "open"});

        // local storage data
        this.gameMode = JSON.parse(localStorage.getItem("mode"));
        this.gameData = JSON.parse(localStorage.getItem("gameData"));
        console.log(this.gameData);
        this.aiDifficulty = JSON.parse(localStorage.getItem('aiDifficulty'));
        this.defaultAiDifficulty = "normal";
        this.chosenColor = JSON.parse(localStorage.getItem("chosenColor"));
        this.defaultColor = "#1E90FF";
        // default game data
        this.paddleWidth = 20;
        this.paddleHeight = 100;
        this.paddleSpeed = 5;
        this.ballRadius = 10;
        this.ballSpeed = 8;
    }

    render () {
        this.shadowRoot.innerHTML = template;
    }

    async connectedCallback () {

        if (!this.gameMode || (this.gameMode === "multiplayer" || this.gameMode === "tournament") && !this.gameData) {
            const custemAlert = new Alert();
            custemAlert.setMessage("problem encountered, please try again");
            custemAlert.modalInstance.show();
            return await Router.redirect('/game');
        }

        this.render();
        this.game = new Game(this.paddleWidth, this.paddleHeight, this.paddleSpeed, this.ballRadius, this.ballSpeed,
            this.aiDifficulty === null ? this.defaultAiDifficulty : this.aiDifficulty, this.chosenColor === null ? this.
            defaultColor : this.chosenColor, this.gameMode, this.gameData);
        if (this.gameMode === "multiplayer") await this.game.initSocket();
        this.game.startGame();

        //get imgs from the local storage
        const leftAvatar = JSON.parse(localStorage.getItem("leftAvatar")) || "/static/assets/imgs/avatar.png";
        const rightAvatar = JSON.parse(localStorage.getItem("rightAvatar")) || "/static/assets/imgs/avatar2.png";
        localStorage.removeItem("leftAvatar");
        localStorage.removeItem("rightAvatar");

        this.shadowRoot.querySelector('avatars-component').setAvatarWithPosition(leftAvatar, "left");
        this.shadowRoot.querySelector('avatars-component').setAvatarWithPosition(rightAvatar, "right");
        this.shadowRoot.querySelector('avatars-component').style.color = "white";
    }
};

export default gameComponent;
