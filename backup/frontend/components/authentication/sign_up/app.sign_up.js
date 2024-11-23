
import { backendGateway } from "../../../core/config.js";
import { Component } from "../../../core/component.js";
import { Http } from "../../../tools/http.js";
import _ from "../../../tools/utils.js";

/* *************************************************************************** #
#   * SignUp Component Class :                                                 #
# *************************************************************************** */
export class SignUp extends Component
{

    /* === template : ======================================================= */
    get template()
    {
        return /* html */ `
            <p class="title"> - Choose One way - </p>
            <div class="container-form">
                <button id="google" class="container-google">
                    <img src="/static/assets/imgs/google_icon.svg" alt="Google Icon">
                    <span>SIGN UP WITH GOOGLE</span>
                </button>

                <button id="intra" class="intra">
                    <img src="/static/assets/imgs/42_icon.svg" alt="Intra Icon">
                    <span>SIGN UP WITH INTRA</span>
                </button>

                <p class="title"> - Or - </p>

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
                <p>Already have an account?
                    <a href="#">Sign in here.</a>
                </p>
            </div>


            <!-- Custom Alert Modal -->
            <div id="customAlert" class="alert-modal">
                <div class="alert-content">
                    <p id="alertMessage" class="alert-message"></p>
                    <button id="closeAlert" class="close-button">OK</button>
                </div>
            </div>
        `;
    }

    /* === styles : ========================================================= */
    get styles()
    {
        return /*css*/`
                :host {
                    width: 75%;
                    font-family: 'Exo2', sans-serif;
                    display: block;
                }

                .title {
                    color: white;
                    margin-bottom: 20px;
                    font-weight: bold;
                    font-size: 1.3em;
                    text-align: center;
                }

                .container-form {
                    display: flex;
                    flex-direction: column;
                    justify-content: center;
                    align-items: center;
                    color: white;
                }

                .container-form button, .input-container {
                    width: 96%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 1rem 0.5rem;
                    border-radius: 50px;
                    border: none;
                    font-family: inherit;
                    font-size: 1rem;
                    font-weight: 600;
                    cursor: pointer;
                    transition: background-color 0.3s, transform 0.1s;
                    margin-bottom: 10px;
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
                    width: 24px;
                    height: 24px;
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
                    margin-top: 30px;
                    margin-bottom: 100px;
                    text-align: center;
                }

                .container-help a {
                    text-decoration: none;
                    color: var(--color-primary);
                }

                .container-help span {
                    text-decoration: underline;
                    cursor: pointer;
                }

                .alert-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    border-radius: 50%;
                    background-color: rgb(1 22 39 / 85%);
                    display: none;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                }

                .alert-content {
                    background-color: white;
                    padding: 20px;
                    border-radius: 48px;
                    text-align: center;
                    max-width: 90%;
                    width: 600px;
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

                /* Media Queries for Responsiveness */
                @media (max-width: 768px) {
                    :host {
                        width: 90%;
                    }

                    .title {
                        font-size: 1.1em;
                    }

                    .container-form button, .input-container {
                        width: 70%;
                        padding: 0.8rem 0.4rem;
                    }

                    .input-field {
                        font-size: 0.9rem;
                    }

                    .container-help {
                        margin-bottom: 50px;
                    }

                    .alert-modal {
                        border-radius: 0;
                    }

                    .alert-content {
                        border-radius: 5px;
                    }
                }

                @media (max-width: 540px) {
                    * {
                        font-size: 1em !important;
                    }

                    .container-form button, .input-container {
                        width: 70%;
                        padding: 0.7rem 0.3rem;
                    }

                    .container-google, .intra, .container-email {
                        padding: 1rem 0.5rem;
                    }

                    .container-form img {
                        width: 16px;
                        height: 16px;
                        margin-right: 0.3rem;
                    }
                }

                @media (max-width: 380px) {
                    * {
                        font-size: 0.9em !important;
                    }

                    .container-form button, .input-container {
                        width: 100%;
                    }
                }
        `;
    }

    /* === onConnected : ==================================================== */
    onConnected()
    {
        const googleButton = this.shadowRoot.getElementById('google');
        const intraButton = this.shadowRoot.getElementById('intra');
        const emailInput = this.shadowRoot.getElementById('email_input');
        const submitButton = this.shadowRoot.getElementById('submit_button');
        const closeButton = this.shadowRoot.getElementById('closeAlert');

        this.addEventListener(googleButton,'click', this.googleCallback);
        this.addEventListener(intraButton,'click', this.intraCallback);
        this.addEventListener(emailInput,'input', this.updateButtonState.bind(this));
        this.addEventListener(submitButton,'click', this.emailCallback.bind(this));
        this.addEventListener(closeButton,'click', this.closeAlert.bind(this));
    }

    /* === alert : ========================================================== */
    alert(message)
    {
        const alertModal = this.shadowRoot.getElementById('customAlert');
        const alertMessage = this.shadowRoot.getElementById('alertMessage');
        alertMessage.textContent = message;
        alertModal.style.display = 'flex';
    }

    /* *********************************************************************** #
    #   * Event callbacks :                                                    #
    # *********************************************************************** */

    /* === googleCallback : ================================================== */
    googleCallback(event)
    {
        event.preventDefault();
        window.location.href = backendGateway.googleAuthUrl;
    }

    /* === intraCallback : ================================================== */
    intraCallback(event)
    {
        event.preventDefault();
        window.location.href = backendGateway.intraAuthUrl;
    }

    /* === updateButtonState : =============================================== */
    updateButtonState(event)
    {
        event.preventDefault();
        const emailInput = this.shadowRoot.getElementById('email_input');
        const submitButton = this.shadowRoot.getElementById('submit_button');

        submitButton.disabled = !_.validateEmail(emailInput.value);
    }

    /* === emailCallback : ================================================== */
    async emailCallback(event)
    {
        event.preventDefault();
        const emailInput = this.shadowRoot.getElementById('email_input');
        const email = emailInput.value.trim();

        if (!_.validateEmail(email))
            return this.alert("Please enter a valid email address.");

        const url = backendGateway.emailSignUpUrl;
        const headers = { 'Content-Type': 'application/json' };
        const data = JSON.stringify({ email });

        const response = await Http.post(url, headers, data);

        console.log("Response", response);
        if (!response.ok)
            return this.alert(response["message"]);

        this.alert("Email sent");
    }

    /* === closeAlert : ====================================================== */
    closeAlert(event)
    {
        event.preventDefault();
        const alertModal = this.shadowRoot.getElementById('customAlert');
        alertModal.style.display = 'none';
    }
}
