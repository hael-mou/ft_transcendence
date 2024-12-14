
import { Component } from "../../core/component.js";
import { Router } from "../../core/routing.js";

/* *************************************************************************** #
#   * GameApp Component Class :                                                #
# *************************************************************************** */
export class GameApp extends Component {

    /* === template : ======================================================= */
    get template() {
        return /*html*/`
            <div class="constainer">
                <button id="remote" class="anchorButton" value="Multiplayer">
                    Remote
                </button>

                <button id="local" class="anchorButton" value="Local">
                    Local
                </button>

                <button id ="ai" class="anchorButton" value="AI">
                    AI
                </button>
            </div>
        `;
    }

    /* === styles : ========================================================= */
    get styles() {
        return /*css*/`

            :host {
                width: 100%;
                height: 100%;
                display: flex;
                font-family: 'Exo2', sans-serif;
                background-color: rgba(44 44 44 / 60%);;
                border-radius: 20px;
                overflow: hidden;
                min-height: 100%;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            .constainer {
                width: 100%;
                height: 100%;
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
            }

            .anchorButton {
                width: min(10rem, 90%);
                height: 4rem;
                margin: 0.5rem;
                background-color: none;
                outline: none;
                border: none;
                border-radius: 0.5rem;
                font-weight: 600;
                background: rgba(255, 255, 255, 0.25);
                box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
                backdrop-filter: blur(4px);
                -webkit-backdrop-filter: blur(4px);
                border-radius: 10px;
                border: 1px solid rgba(255, 255, 255, 0.18);
                color: #F0F8FF;
            }

            .anchorButton:hover {
                background-color: rgba(255, 255, 255, 0.107);
                cursor: pointer;
            }


        `;
    }

    /* === onConnected : =================================================== */
    onConnected() {
        const remote = this.shadowRoot.getElementById('remote');
        const local = this.shadowRoot.getElementById('local');
        const ai = this.shadowRoot.getElementById('ai');

        this.resetLocalStorage();

        this.addEventListener(remote, 'click', this.clickHandler.bind(this));
        this.addEventListener(local, 'click', this.clickHandler.bind(this));
        this.addEventListener(ai, 'click', this.clickHandler.bind(this));
    }

    /* === resetLocalStorage : ============================================= */
    resetLocalStorage() {
        localStorage.removeItem("mode");
        localStorage.removeItem("chosenColor");
        localStorage.removeItem("gameData");
        localStorage.removeItem("aiDifficulty");
    }

    /* === clickHandler : ================================================== */
    clickHandler(event) {

        const mode = event.target.getAttribute('value');
        localStorage.setItem("mode", JSON.stringify(mode.toLowerCase()));
        event.target.setAttribute('data-link', "/game/matchmaker");
        Router.handleRouting.call(this, event);
    }

}
