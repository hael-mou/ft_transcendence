import { Component } from "../../core/component.js";
import { authGateway } from "../../core/config.js";
import { utils as _ } from "../../tools/utils.js";
import { Router } from "../../core/routing.js";
import { Http } from "../../tools/http.js";
import { Auth } from "../../tools/http.js";

/* *************************************************************************** #
#   * OtpVerification Class :                                                  #
# *************************************************************************** */

export class OtpVerification extends Component
{
    /* === template : ======================================================= */
    get template()
    {
        return /* html */ `
        <div class="container">
            <h1>Enter Verification Code</h1>
            <p>We've sent a verification code to your email</p>
            <div class="otp-container">
                <input type="text" maxlength="1" class="otp-input" autofocus>
                <input type="text" maxlength="1" class="otp-input">
                <input type="text" maxlength="1" class="otp-input">
                <input type="text" maxlength="1" class="otp-input">
                <input type="text" maxlength="1" class="otp-input">
                <input type="text" maxlength="1" class="otp-input">
            </div>
            <button id="verify-btn" class="verify-btn" disabled>Verify Code</button>
            <div id="resend-otp" class="resend">Resend Code if you enabled 2FA with email</div>
        </div>
    `;}

    /* === Styles : ========================================================= */
    get styles()
    {
        return /*css*/`
            :host 
            {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                position: relative;
                overflow: hidden;
            }
            .container {
                width: 100%;
                max-width: 400px;
                padding: 2rem;
                text-align: center;
                z-index: 1;
            }
            .logo {
                margin-bottom: 2rem;
            }
    
            .logo img {
                width: 120px;
                height: auto;
            }
    
            h1 {
                color: white;
                font-size: 1.5rem;
                margin-bottom: 1rem;
                font-weight: 600;
            }
    
            p {
                color: #a0aec0;
                margin-bottom: 2rem;
                font-size: 0.95rem;
            }
            .otp-container {
                display: flex;
                gap: 0.5rem;
                justify-content: center;
                margin-bottom: 2rem;
            }
            .otp-input {
                width: 50px;
                height: 50px;
                border: 2px solid #2d3748;
                border-radius: 12px;
                background: transparent;
                color: white;
                font-size: 1.25rem;
                text-align: center;
                transition: all 0.3s ease;
            }
            .otp-input:focus {
                border-color: #4fd1c5;
                outline: none;
                box-shadow: 0 0 0 2px rgba(79, 209, 197, 0.2);
            }
            .verify-btn {
                width: 100%;
                padding: 1rem;
                border: none;
                border-radius: 25px;
                background: #4fd1c5;
                color: white;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: background 0.3s ease;
            }
            .verify-btn:hover {
                background: #38b2ac;
            }
    
            .verify-btn:disabled {
                background: #2d3748;
                cursor: not-allowed;
            }
    
            .resend {
                margin-top: 1rem;
                color: #4fd1c5;
                text-decoration: none;
                font-size: 0.9rem;
                cursor: pointer;
            }
    
            .resend:hover {
                text-decoration: underline;
            }
        `;
    }

    /* === onConnected : ==================================================== */
    onConnected() {
        const otpInputs = this.shadowRoot.querySelectorAll('.otp-input');
        const verifyButton = this.shadowRoot.getElementById('verify-btn');
        const resendOtp = this.shadowRoot.getElementById('resend-otp');

        otpInputs.forEach((input, index) => {
            this.addEventListener(input, 'input', (event) => 
                updateButtonState.bind(this)(event, input, index));
        });
        this.addEventListener(verifyButton,'click', verifyCallback.bind(this));
        this.addEventListener(resendOtp,'click', resendOtpCallback.bind(this));
    }
}
    /* === updateButtonState : ======================================================= */
    function updateButtonState(event, input, index) {
        const value = event.target.value;
        const otpInputs =  this.shadowRoot.querySelectorAll('.otp-input');
        const verifyButton = this.shadowRoot.getElementById('verify-btn');

        if (!/^\d*$/.test(value)) {
            input.value = '';
            return;
        }
        if (value && index < otpInputs.length - 1) {
            otpInputs[index + 1].focus();
        }

        const isComplete = Array.from(otpInputs).every(input => input.value);
        verifyButton.disabled = !isComplete;
    }


/* === verifyCallback : ======================================================= */
async function  verifyCallback() {
    const otpInputs = this.shadowRoot.querySelectorAll('.otp-input');
    const otp = Array.from(otpInputs).map(input => input.value).join('');
    const url = authGateway.verify2FaUrl;
    const headers = { 'Content-Type': 'application/json' };
    const data = JSON.stringify({ otp });

    const response = await Http.post(url, headers, data);
    if (!response.info.ok) {
        if (response.json["error"][0] === "cookie not found"){
            const alert = document.createElement('custom-alert');
            alert.setMessage("back to sign in");
            return alert.modalInstance.show();
        }
        const alert = document.createElement('custom-alert');
        alert.setMessage(`${response.json["error"]}, demand a new code`);
        return alert.modalInstance.show();
    }
    await Auth.getAccessToken();
    await Router.redirect('/profile');
}

/* === resendOtpCallback : ======================================================= */
async function resendOtpCallback() {
    const resendUrl = authGateway.resendOtpUrl;

    try {
        const response = await Http.get(resendUrl);

        const alert = document.createElement('custom-alert');
        if (!response.info.ok) {
            const errorMessage = response.json.error[0];
            const alertMessage = errorMessage === "cookie not found"
                ? "back to sign in"
                : errorMessage;

            alert.setMessage(alertMessage);
            alert.modalInstance.show();
            return;
        }

        alert.setMessage("Otp sent successfully");
        alert.modalInstance.show();
    } catch (error) {
        console.error(error);
    }
}
