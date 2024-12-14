import { Component } from "../../core/component.js";
import { authGateway } from "../../core/config.js";
import { utils as _ } from "../../tools/utils.js";
import { Http } from "../../tools/http.js";

/* *************************************************************************** #
#   * SecuritySettings Component Class :                                       #
# *************************************************************************** */
export class SecuritySettings extends Component
{
    /* === template : ======================================================= */
    get template() {
        return /* html */ `
               <section class="security-settings d-flex flex-column" id="security-settings">
               <form class="password-form">
                    <div class="row mb-3 gy-3">
                        <div class="col-md-6">
                            <div class="input-container">
                                <img src="/static/assets/imgs/email_icon.svg" alt="Password Icon">
                                <input id="password_input" type="password" class="input-field"
                                    placeholder="Old Password">
                            </div>
                        </div>
                        <div class="col-md-6">
                            <div class="input-container">
                                <img src="/static/assets/imgs/email_icon.svg" alt="password Icon">
                                <input id="new_password_input" type="password" class="input-field"
                                    placeholder="New Password">
                            </div>
                        </div>
                    </div>
                    <button id="updatePasswordButton" type="submit" class="btn-update-password" disabled>Update password</button>
                </form>
                <div class="container">
                    <h1>Two-Factor Authentication</h1>
                    
                    <form id="2fa_settings_form">
                        <div class="form-group">
                            <h2>Enable/Disable 2FA</h2>
                            
                            <div class="toggle-container">
                                <label for="enable_2fa" class="toggle-label">Enable 2FA</label>
                                <input id="enable_2fa" type="checkbox" class="toggle-checkbox">
                            </div>
                        </div>
            
                        <div id="password_div" class="form-group">
                            <input id="2fa-password-input" type="password" placeholder="Enter Password" class="twofa-password-input" required>
                        </div>
            
                        <div id="auth_method" class="form-group hidden">
                            <p class="auth-method">Choose your authentication method:</p>
                            <div class="button-group">
                                <button class="twofa-choice" type="button" id="email_method">Email</button>
                                <button class="twofa-choice" type="button" id="app_method">Authenticator App</button>
                            </div>
                        </div>
            
                        <div class="form-group">
                            <button id="save_2fa" type="submit" class="save-button">Save Settings</button>
                        </div>
                    </form>
            
                    <div id="qr_code" class="qr-code hidden">
                        <p>Scan the QR Code with your authenticator app:</p>
                        <img id="qr_image" src="" alt="QR Code">
                    </div>
            
                    <div id="status-message" class="status-message hidden">
                        <p>2FA has been successfully updated!</p>
                    </div>
                </div>
            </section>
        `;
    }

     /* === style : ======================================================= */
     get styles() {
        return /* css */ `
            @import url("https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/css/bootstrap.min.css");
            @import url("/static/assets/styles/common-style.css");

            :host {
                font-family: 'Exo2', sans-serif;
                color: var(--color-text);
                width: 100%;
            }

            .security-settings {
                width: min(500px, 100%);
            }

            .btn-update-password, .input-container {
                width: 100%;
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

            .input-container {
                box-sizing: border-box;
                background-color: rgba(255, 255, 255, 0.1);
                border: 2px solid var(--color-border);
                padding-left: 1.5rem;
            }

            .input-container img {
                width: 18px;
                height: 18px;
                margin-right: 0.5rem;
                margin-left: 12px;
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
            .btn-update-password , .save-2fa-settings {
                background-color: #007088;
                color: white;
                border: none;
                padding: 10px 20px;
                border-radius: 25px;
                cursor: pointer;
                font-size: 1em;
                font-weight: bold;
                transition: background-color 0.3s;
                margin-top: 1.5rem;
                width: 50%;
                margin-left: auto;
            }

            .btn-update-password:hover {
                background-color: #005f74;
            }

            .active {
                box-shadow: inset 0 0 9px 5px #005061;
            }
            button[disabled] {
                background-color: #b0b0b0 !important;
                cursor: not-allowed !important;
                opacity: 0.6 !important;
            }

            button[disabled]:hover {
                background-color: #b0b0b0 !important;
            }

            /* === 2FA : ================================================================================= */
            .container {
                width: 100%;
                max-width: 28rem;
                padding: 2rem;
                background-color: #cccccc1c;
                margin: 2rem auto;
                border-radius: 0.5rem;
                box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
            }
            
            h1 {
                font-size: 1.875rem;
                font-weight: bold;
                text-align: center;
                margin-bottom: 2rem;
            }
            
            .form-group {
                margin-bottom: 1.5rem;
            }
            
            h2 {
                font-size: 1.25rem;
                font-weight: 600;
                text-align: center;
                margin-bottom: 1rem;
            }
            
            .toggle-container {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .toggle-label {
                font-size: 1.125rem;
            }
            
            .toggle-checkbox {
                appearance: none;
                width: 3.5rem;
                height: 2rem;
                background-color: var(--bs-gray-800);
                border-radius: 999px;
                position: relative;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .toggle-checkbox:checked {
                background-color: var(--color-secondary);
            }
            
            .toggle-checkbox::after {
                content: "";
                position: absolute;
                top: 0.25rem;
                left: 0.25rem;
                width: 1.5rem;
                height: 1.5rem;
                background-color: white;
                border-radius: 50%;
                transition: transform 0.2s;
            }
            
            .toggle-checkbox:checked::after {
                transform: translateX(1.5rem);
            }
            
            .hidden {
                display: none;
            }
            
            input[type="password"] {
                width: 100%;
                padding: 0.5rem 1rem;
                border-radius: 0.25rem;
                background-color: var(--gray-700);
                border: 1px solid var(--gray-600);
                color: var(--light);
            }

            
            input[type="password"]:focus {
                border-color: var(--blue-500);
                outline: none;
            }
            
            .auth-method {
                text-align: center;
                color: #a0aec0;
                margin-bottom: 1rem;
            }
            
            .button-group {
                display: flex;
                justify-content: space-around;
            }
            
            .button-group button {
                background: #007274;
            }
            .twofa-choice {
                padding: 0.5rem 1.5rem;
                background-color: var(--gray-700);
                color: white;
                border: none;
                border-radius: 0.25rem;
                cursor: pointer;
                transition: background-color 0.2s;
            }
            
            .twofa-choice:hover, .save-button:hover {
                background-color: #02babd;
            }
            
            .twofa-choice:focus {
                outline: none;
                box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.5);
            }
            
            .selected {
                background-color: var(--blue-600);
            }
            
            .save-button {
                width: 100%;
                height:2.75rem;
                background-color: #007274;
                border-radius: 10px;
                color: white;
                font-size: 1.10rem;
            }
            
            .qr-code {
                text-align: center;
                margin-top: 1rem;
            }
            
            .qr-code p {
                color: #a0aec0;
                margin-bottom: 1rem;
            }
            
            .qr-code img {
                margin: 0 auto;
            }
            
            .status-message {
                text-align: center;
                color: var(--green-500);
                font-size: 0.875rem;
                margin-top: 1rem;
            }
            input[id="2fa-password-input"] {
                background: rgba(255, 255, 255, 0.1);
                border-radius: 10px;
                padding: 10px 10px;
            }
        `;
    }
    /* === OnconnectEd : ======================================================= */
    onConnected() {
        const updatePasswordBtn = this.shadowRoot.getElementById('updatePasswordButton');
        const OldPasswordInput = this.shadowRoot.getElementById('password_input');
        const NewPasswordInput = this.shadowRoot.getElementById('new_password_input');
        
        this.addEventListener( OldPasswordInput,'input', updateButtonState.bind(this));
        this.addEventListener(NewPasswordInput,'input', updateButtonState.bind(this));
        this.addEventListener(updatePasswordBtn, 'click', updatePassword.bind(this));


        /*================= 2FA ================================================*/
        const enable2faCheckbox = this.shadowRoot.getElementById("enable_2fa");
        const authMethodButtons = this.shadowRoot.querySelectorAll("#email_method, #app_method");
        const saveButton = this.shadowRoot.getElementById("save_2fa");

        this.addEventListener(enable2faCheckbox,'change', spanCallback.bind(this));

        authMethodButtons.forEach(button => {
            this.addEventListener(button, 'click', function() {
                authMethodButtons.forEach(btn => btn.classList.remove('selected'));
                button.classList.add('selected');
            });
        });

        this.addEventListener(saveButton, 'click', save_2faSettings.bind(this));
    }
}

/* === updateButtonState : =============================================== */
function updateButtonState(event)
{
    event.preventDefault();
    const PasswordInput = this.shadowRoot.getElementById('password_input');
    const NewPasswordInput = this.shadowRoot.getElementById('new_password_input');
    const submitButton = this.shadowRoot.getElementById('updatePasswordButton');

    submitButton.disabled = !_.validatePassword(NewPasswordInput.value)
                            || PasswordInput.value.length < 8;
}


/* === UpdatePassword : ======================================================= */
async function updatePassword(event) {

    event.preventDefault();
    const alert = document.createElement('custom-alert');
    const old_password = this.shadowRoot.getElementById('password_input').value;
    const new_password = this.shadowRoot.getElementById('new_password_input').value;

    const url = authGateway.changePasswordUrl;
    const headers = { 'Content-Type': 'application/json' };
    const data = JSON.stringify({ old_password, new_password });

    const response = await Http.patchwithAuth(url, headers, data);
    if (!response.info.ok) {
        alert.setMessage(response.json["error"]);
        return alert.modalInstance.show();
    }
    alert.setMessage("Password updated successfully");
    alert.modalInstance.show();
}



/* ========== Span CallBack ================================================ */
function spanCallback(event) {
    const authMethodDiv = this.shadowRoot.getElementById("auth_method");
    const qrCodeDiv = this.shadowRoot.getElementById("qr_code");
    const enable2faCheckbox = this.shadowRoot.getElementById("enable_2fa");

    if (enable2faCheckbox.checked) {
        authMethodDiv.classList.remove("hidden");
    } else {
        authMethodDiv.classList.add("hidden");
        qrCodeDiv.classList.add("hidden");
    }
}


/* ========== Save 2FA Settings ================================================ */
async function save_2faSettings(event) {
    event.preventDefault()

    const alert = document.createElement('custom-alert');
    const passwordInput = this.shadowRoot.getElementById("2fa-password-input");
    const selectedQuery = this.shadowRoot.querySelector('.selected');
    const enable2faCheckbox = this.shadowRoot.getElementById("enable_2fa");
    const password = passwordInput.value;
    

    if (!password){
        alert.setMessage("Please enter your password");
        alert.modalInstance.show();
        return;
    }
    const selectedMethod = selectedQuery?.id === "email_method" ? "email" : "totp";
    if (enable2faCheckbox.checked)
    {
        if (!selectedQuery) {
            alert.setMessage("Please choose an authentication method.");
            alert.modalInstance.show();
            return;
        }
        await Enable_2fa.bind(this)(password, selectedMethod);
    }
    else 
        await Disable_2fa.bind(this)(password, selectedMethod);
}

async function Enable_2fa(password, choice) {


    const alert = document.createElement('custom-alert');
    const statusMessage = this.shadowRoot.getElementById("status-message");
    const qrCodeDiv = this.shadowRoot.getElementById("qr_code");
    const qrImage = this.shadowRoot.getElementById("qr_image");
    

    const url = authGateway.enable2FaUrl;
    const headers = { 'Content-Type': 'application/json' };
    const data = JSON.stringify({ password, choice });

    const response = await Http.postwithAuth(url, headers, data);   
    if (!response.info.ok) {
        alert.setMessage(response.json["error"]);
        return alert.modalInstance.show();
    }

    statusMessage.classList.remove("hidden");
    if (choice === "totp"){
        const qrUrl = authGateway.getQrCodeUrl;
        const qrResponse = await Http.getwithAuth(qrUrl);
        if (qrResponse.info.ok) {
            const qr_url = "data:image/png;base64, " + qrResponse.json["qr_code"];
            qrImage.src = qr_url;
            qrCodeDiv.classList.remove("hidden");
            return;
        }
        alert.setMessage("An error occurred while saving settings., retry later.");
        alert.modalInstance.show();
    }
}


async function Disable_2fa(password, choice) {
    const alert = document.createElement('custom-alert');
    const url = authGateway.disable2FaUrl;
    const headers = { 'Content-Type': 'application/json' };
    const data = JSON.stringify({ password, choice });

    const response = await Http.postwithAuth(url, headers, data);
    if (!response.info.ok) {
        alert.setMessage(response.json["error"]);
        return alert.modalInstance.show();
    }

    const statusMessage = this.shadowRoot.getElementById("status-message");
    statusMessage.textContent = "2fa disabled successfully";
    statusMessage.classList.remove("hidden");
}