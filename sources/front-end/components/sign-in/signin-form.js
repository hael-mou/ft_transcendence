
import { Component } from "../../core/component.js";
import { authGateway } from "../../core/config.js";
import { utils as _ } from "../../tools/utils.js";
import { Router } from "../../core/routing.js";
import { Http } from "../../tools/http.js";
import { Auth } from "../../tools/http.js";

/* *************************************************************************** #
#   * SignUp Component Class :                                                 #
# *************************************************************************** */
export class SignIn extends Component
{
    /* === template : ======================================================= */
    get template() {

        return /* html */ `
        <p class="title"> - Sign In - </p>
        <div class="container-form">
            <button id="google" class="container-google">
                <img src="/static/assets/imgs/google_icon.svg" alt="Google Icon">
                <span>SIGN IN WITH GOOGLE</span>
            </button>

            <button id="intra" class="intra">
                <img src="/static/assets/imgs/42_icon.svg" alt="Intra Icon">
                <span>SIGN IN WITH INTRA</span>
            </button>

            <p class="title"></p>

            <div class="input-container">
                <img src="/static/assets/imgs/email_icon.svg" alt="Email Icon">
                <input id="email_input" type="email" class="input-field"
                    placeholder="Email" required>
            </div>

            <div class="input-container">
                <img src="/static/assets/imgs/pwd_icon.svg" alt="Password Icon">
                <input id="password_input" type="password" class="input-field"
                    placeholder="password" required>
                <a id="toggle_password" type="button" class="view-button">
                    <img id="toggle_icon" src="/static/assets/imgs/eye-slash.svg"
                         alt="View Icon">
                </a>
            </div>


            <button id="submit_button" class="container-email" disabled>
            SIGN IN WITH EMAIL
            </button>
        </div>

        <div class="container-help">
            <p>Don't have an account?
                <a id="sign_up_link" data-link="/sign-up">
                    Sign up here.
                </a>
            </p>
            <p>
                <a id="reset_pwd_link" data-link="/reset-password">
                    Forgot password?
                </a>
            </p>
        </div>
        `
    };

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

            .view-button {
                padding: 1px 16px 0 0;
                cursor: pointer;
                background-color: transparent;
                border: none;
                display: flex;
                align-items: center;
                justify-content: center;
            }

            .view-button img {
                width: 22px;
                height: 22px;
            }

            .view-button:hover {
                filter: brightness(0.8);
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
        const intraButton = this.shadowRoot.getElementById('intra');
        const signUpLink = this.shadowRoot.getElementById('sign_up_link');
        const resetPwdLink = this.shadowRoot.getElementById('reset_pwd_link');
        const emailInput = this.shadowRoot.getElementById('email_input');
        const PasswordInput = this.shadowRoot.getElementById('password_input');
        const togglePwdBtn = this.shadowRoot.getElementById('toggle_password');
        const submitButton = this.shadowRoot.getElementById('submit_button');


        this.addEventListener(googleButton,'click', googleCallback);
        this.addEventListener(intraButton,'click', intraCallback);
        this.addEventListener(signUpLink,'click', Router.handleRouting.bind(this));
        this.addEventListener(resetPwdLink,'click', Router.handleRouting.bind(this));
        this.addEventListener(emailInput,'input', updateButtonState.bind(this));
        this.addEventListener(PasswordInput,'input', updateButtonState.bind(this));
        this.addEventListener(togglePwdBtn,'click', togglePassword.bind(this));
        this.addEventListener(submitButton,'click', emailCallback.bind(this));

        this.addEventListener(PasswordInput,'keypress', async (event) => {
            if ( event.key === 'Enter'
                 && _.validateEmail(emailInput.value)
                 && PasswordInput.value.length >= 8)
            {
                event.preventDefault();
                await emailCallback.call(this, event);
            }
        });
    }
}

/* **************************************************************************** #
#   * Event callbacks :                                                         #
# **************************************************************************** */

/* === googleCallback : ===================================================== */
function googleCallback(event) {

    event.preventDefault();
    window.location.href = authGateway.googleUrl;
}

/* === intraCallback : ====================================================== */
function intraCallback(event) {

    event.preventDefault();
    window.location.href = authGateway.intraUrl;
}

/* === updateButtonState : ================================================== */
function updateButtonState(event) {

    event.preventDefault();
    const emailInput = this.shadowRoot.getElementById('email_input');
    const passwordInput = this.shadowRoot.getElementById('password_input');
    const submitButton = this.shadowRoot.getElementById('submit_button');

    submitButton.disabled = !_.validateEmail(emailInput.value)
                            || passwordInput.value.length < 8;
}


/* === togglePassword : ===================================================== */
function togglePassword(event) {

    event.preventDefault();
    const pwdInput = this.shadowRoot.getElementById('password_input');
    const toggleImg = this.shadowRoot.getElementById('toggle_icon');

    const type = pwdInput.type === 'password' ? 'text' : 'password';
    pwdInput.type = type;

    if (type === 'password') {
        toggleImg.src = '/static/assets/imgs/eye-slash.svg';
    } else {
        toggleImg.src = '/static/assets/imgs/eye.svg';
    }
}

/* === emailCallback : ====================================================== */
async function emailCallback(event)
{
        event.preventDefault();

        const emailInput = this.shadowRoot.getElementById('email_input');
        const passwordInput = this.shadowRoot.getElementById('password_input');
        const email = emailInput.value.trim();
        const password = passwordInput.value;

        const headers = { 'Content-Type': 'application/json' };
        const data = JSON.stringify({ email, password });

        const response = await Http.post(authGateway.loginUrl, headers, data);

        if (!response.info.ok) {
            const alert = document.createElement('custom-alert');
            alert.setMessage(response.json["error"]);
            return alert.modalInstance.show();
        }
        if (response.json["2fa_enabled"])
            return Router.redirect('/verify-2fa');
        await Auth.getAccessToken();
        await Router.redirect('/profile');
}
