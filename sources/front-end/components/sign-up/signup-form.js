
import { Component } from "../../core/component.js";
import { authGateway } from "../../core/config.js";
import { utils as _ } from "../../tools/utils.js";
import { Router } from "../../core/routing.js";
import { Http } from "../../tools/http.js";

/* *************************************************************************** #
#   * SignUp Component Class :                                                 #
# *************************************************************************** */
export class SignUp extends Component
{

    /* === template : ======================================================= */
    get template() {
        return /* html */ `
            <p class="title"> - Sign Up - </p>
            <div class="container-form">
                <button id="google" class="container-google">
                    <img src="/static/assets/imgs/google_icon.svg" alt="Google Icon">
                    <span>SIGN UP WITH GOOGLE</span>
                </button>

                <button id="intra" class="intra">
                    <img src="/static/assets/imgs/42_icon.svg" alt="Intra Icon">
                    <span>SIGN UP WITH INTRA</span>
                </button>

                <p class="title"></p>

                <div class="input-container">
                    <img src="/static/assets/imgs/email_icon.svg" alt="Email Icon">
                    <input id="email_input" type="email" class="input-field"
                        placeholder="Email" required>
                </div>

                <button id="submit_button" class="container-email" disabled>
                    SIGN UP WITH EMAIL
                </button>
            </div>

            <div class="container-help">
                <p>Already have an account?</p>
                <a id="sign_in_link" data-link="/sign-in">
                    Sign in here.
                </a>
            </div>
        `;
    }

    /* === styles : ========================================================= */
    get styles() {
        return /*css*/`
            :host {
                width: 75%;
                font-family: 'Exo2', sans-serif;
                display: block;
            }

            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            .title {
                color: white;
                font-weight: bold;
                font-size: 1em;
                text-align: center;
                margin-bottom: 27px;
            }

            .container-form {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
            }

            .container-form button, .input-container {
                width: 100%;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 0.7rem;
                border-radius: 5px 50px;
                border: none;
                font-family: inherit;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: background-color 0.3s, transform 0.1s;
                margin-bottom: 10px;
                font-size: 0.8rem !important;
                box-shadow: 0 0 12px 0px rgb(159 159 159 / 54%);
            }

            button[disabled] {
                background-color: #b0b0b0 !important;
                cursor: not-allowed !important;
                opacity: 0.6 !important;
            }

            button[disabled]:hover {
                background-color: #b0b0b0 !important;
            }

            .input-container {
                box-sizing: border-box;
                background-color: rgba(255, 255, 255, 0.1);
                border: 2px solid var(--color-border);
                padding-left: 1.5rem;
            }

            .input-field {
                background-color: transparent;
                border: none;
                outline: none;
                color: white;
                font-size: 1rem;
                font-family: inherit;
                width: 100%;
                padding: 0 0.5rem;
            }

            .input-container img {
                margin-left: 12px;
            }

            .container-form img {
                width: 18px;
                height: 18px;
                margin-right: 0.5rem;
            }

            .container-google {
                background-color: var(--color-google);
                color: var(--color-bg);
                border: 2px solid #000;
            }

            .container-google span {
                font-family: 'Exo2', sans-serif;
                font-weight: 750;
                font-size: 1em;
            }

            .container-google:hover {
                background-color: #ffffff82;
            }

            .intra {
                background-color: var(--color-secondary);
                color: var(--color-text);
            }

            .intra:hover {
                background-color: #003c42;
            }

            .intra span {
                text-align: center;
                margin-right: 11px;
            }

            .container-email {
                background-color: #007088;
                color: var(--color-text);
                text-align: center;
            }

            .container-email:hover {
                background-color: var(--color-primary);
            }

            .container-help {
                color: white;
                text-align: center;
                font-size: 0.8rem;
            }

            .container-help a {
                text-decoration: none;
                color: var(--color-primary);
            }

            .container-help span {
                text-decoration: underline;
                cursor: pointer;
            }

            /* Media Queries for Responsiveness */
            @media (max-width: 768px) {
                :host {
                    width: 90%;
                }

                .container-form button, .input-container {
                    width: 70%;
                    font-size: 0.9rem;
                }

                .container-help {
                    margin-bottom: 50px;
                }

            }

            @media (max-width: 600px) {
                * {
                    font-size: 0.9em !important;
                }

                :host {
                    width: 100%;
                }

                .container-form button, .input-container {
                    width: 80%;
                }

                .container-form img {
                    width: 16px;
                    height: 16px;
                    margin-right: 0.3rem;
                }
            }

            @media (max-width: 480px) {
                * {
                    font-size: 0.8em !important;
                }

                .container-form button, .input-container {
                    width: 90%;
                }
            }
        `;
    }

    /* === onConnected : ==================================================== */
    onConnected() {

        const googleButton = this.shadowRoot.getElementById('google');
        const intraButton  = this.shadowRoot.getElementById('intra');
        const emailInput   = this.shadowRoot.getElementById('email_input');
        const submitButton = this.shadowRoot.getElementById('submit_button');
        const signInLink   = this.shadowRoot.getElementById('sign_in_link');

        this.addEventListener(signInLink,'click', Router.handleRouting.bind(this));
        this.addEventListener(googleButton,'click', googleCallback);
        this.addEventListener(intraButton,'click', intraCallback);
        this.addEventListener(submitButton,'click', emailCallback.bind(this));
        this.addEventListener(emailInput,'input', updateButtonState.bind(this));
        this.addEventListener(emailInput,'keypress', async (event) => {
            if (event.key === 'Enter' && _.validateEmail(emailInput.value)) {
                event.preventDefault();
                await emailCallback.call(this, event);
            }
        });
    }
}

/* *************************************************************************** #
#   * Event callbacks :                                                        #
# *************************************************************************** */

    /* === googleCallback : ============================================== */
    function googleCallback(event) {
        event.preventDefault();
        window.location.href = authGateway.googleUrl;
    }

    /* === intraCallback : =============================================== */
    function intraCallback(event) {

        event.preventDefault();
        window.location.href = authGateway.intraUrl;
    }

    /* === updateButtonState : =========================================== */
    function updateButtonState(event) {

        event.preventDefault();
        const emailInput = this.shadowRoot.getElementById('email_input');
        const submitButton = this.shadowRoot.getElementById('submit_button');

        submitButton.disabled = !_.validateEmail(emailInput.value);
    }

    /* === emailCallback : =============================================== */
    async function emailCallback(event) {

        event.preventDefault();
        const alert = document.createElement('custom-alert');
        const emailInput = this.shadowRoot.getElementById('email_input');
        const email = emailInput.value.trim();
        const headers = { 'Content-Type': 'application/json' };
        const data = JSON.stringify({ email });

        const response = await Http.post(authGateway.signUpUrl, headers, data);

        if (!response.info.ok) {
            alert.setMessage(response.json["error"]);
            return alert.modalInstance.show();
        }

        alert.setMessage("Successfully sent email");
        alert.modalInstance.show();
    }
