
import { Component } from "./../core/component.js";

/* *************************************************************************** #
#   * Alert Component Class :                                                  #
# *************************************************************************** */
export class Alert extends Component
{
    /* === constructor : ==================================================== */
    constructor() {
        super();
        this.alertElement = document.createElement('div');
        this.alertElement.classList.add('modal', 'fade');
        this.alertElement.setAttribute('id', 'customAlert');
        this.alertElement.setAttribute('tabindex', '-1');
        this.alertElement.setAttribute('aria-labelledby', 'exampleModalLabel');
        this.alertElement.setAttribute('aria-hidden', 'true');
        this.alertElement.innerHTML = `<style>${this.styles}</style>${this.template}`;

        this.modalInstance = new bootstrap.Modal(this.alertElement, {
            keyboard: true,
            backdrop: 'static',
            focus: true,
        });
    }

    /* === template : ======================================================= */
    get template() {
        return /*html*/`
            <div class="modal-dialog modal-dialog-centered">
                <div class="alert-content modal-content">
                    <p id="errorMessage" class="alert-message"></p>
                    <button type="button"
                            class="btn btn-secondary w-25 m-auto
                            close-button" data-bs-dismiss="modal"
                    >ok
                    </button>
                </div>
            </div>
        `;
    }

    /* === styles : ========================================================= */
    get styles() {
        return /*css*/`

            @import url("/static/assets/styles/common-style.css");

            .alert-content {
                background-color: white;
                padding: 20px;
                border-radius: 48px;
                text-align: center;
                max-width: 90%;
                width: 600px;
                font-family: 'Exo2', sans-serif;
            }

            .alert-message {
                margin-bottom: 20px;
                font-size: 1.2em;
                color: black;
            }

            .close-button {
                background-color: #007088;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 1em;
                font-weight: bold;
                transition: background-color 0.3s;
            }

            .close-button:hover {
                background-color: #005f74;
            }

            .modal-dialog-centered {
                display: flex;
                justify-content: center;
                align-items: center;
                min-height: 100%;
            }

            .modal {
                overflow: hidden !important;
            }
        `;
    }

    /* === onConnected : ==================================================== */
    onConnected() {

        this.addEventListener(this.shadowRoot, 'keydown', (event) => {
            if (event.key === 'Escape' || event.key === 'Enter') {
                this.modalInstance.hide();
            }
        });
    }

    /* === methods : ======================================================== */
    setMessage(message) {
        this.alertElement.querySelector('#errorMessage').textContent = message;
    }
}
