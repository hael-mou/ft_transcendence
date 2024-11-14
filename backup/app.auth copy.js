
import { Component } from "../core/component.js";
import { svgIconManager } from "../core/svgManager.js";

/* *************************************************************************** #
#   * AuthApp Component Class :                                                #
# *************************************************************************** */
export class AuthApp extends Component
{

    /* === template : ================================================== */
    get template() {
        return /* html */ `
            <header class="top-bar">
                <img src="/static/assets/imgs/logo.svg" class="logo" alt="Logo">
            </header>

            <div class="container-main">
                <slot></slot>
            </div>
        `;
    }


    /* === styles : ================================================== */
    get styles() {
        return /*css*/`
        :host {
            --main-color: #219494;
            --text-color: #ffffff;
            --gradient-start: rgba(56, 56, 56, 0.5);
            --gradient-end: rgba(44, 44, 44, 0.5);

            width: 100%;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            color: var(--text-color);
        }

        .top-bar {
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px 40px;
            margin: 50px 0;
            width: 30%;
            background: linear-gradient(to right, var(--gradient-start) 3%, var(--gradient-end) 100%);
            border-radius: 20px;
        }

        .logo {
            width: 190px;
            height: auto;
        }

        .container-main {
            padding: 20px 40px;
            width: 30%;
            height: 50%;
            background: linear-gradient(to right, var(--gradient-start) 3%, var(--gradient-end) 100%);
            border-top: 1px solid rgba(255, 255, 255, 0.2);
            display: flex;
            border-radius: 5px;
            justify-content: center;
            align-items: center;
        }

        @media (max-width: 768px)
        {
            .top-bar {
                justify-content: center;
                width: 100%;
                padding: 10px;
            }

            .logo {
                width: 150px;
            }
        }
        `
    }
}
