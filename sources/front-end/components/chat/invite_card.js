
import { Component } from "../../core/component.js";

/* *************************************************************************** #
#   * InviteCard Component Class :                                             #
# *************************************************************************** */
export class InviteCard extends Component {

    /* === Constructor : ==================================================== */
    constructor(type)
    {
        super();
        this.type = type || 'sent';
    }

    /* === Template : ====================================================== */
    get template()
    {
        return /* html */ `
            <div class="invite-card">
                <p> You're invited to join the game 🎮</p>
                <button id="join"> >> Join << </button>
            </div>
        `;
    }

    /* === Styles : ========================================================= */
    get styles()
    {
        return /* css */ `
            :host {
                display: flex;
                flex-direction: column;
                align-items: center;
                color: #fff;
            }

            * {
                box-sizing: border-box;
                margin: 0;
                padding: 0;
                font-family: 'Exo2', sans-serif !important;
            }

            .invite-card {
                width: 100%;
                margin: 3px 15px;
                border-radius: 10px;
                word-wrap: break-word;
                display: flex;
                flex-direction: column;
                gap: 12px;
            }

            .invite-card p {
                margin-bottom: 10px;
                font-size: 1em;
                color: ${this.type === 'sent' ? '#fff' : '#000'};
            }

            .invite-card button {
                background-color: transparent;
                border: none;
                color: ${this.type === 'sent' ? '#fff' : '#000'};
                border-radius: 25px;
                cursor: pointer;
                font-size: 1.1em;
                align-self: center;
                font-weight: 900;
            }

            .invite-card button:hover {
                text-decoration: underline;
            }

            @media (max-width: 600px) {
                .invite-card p {
                    font-size: 0.8em;
                }

                .invite-card button {
                    font-size: 0.9em;
                }

            }

        `;
    }
}
