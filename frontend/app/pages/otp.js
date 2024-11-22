
import { Component } from "../core/component.js";

/* *************************************************************************** #
#   * OTP Class :                                                              #
# *************************************************************************** */

export class OTP extends Component {
    get styles() {
        return /*css*/`
        :host {
            font-family: Arial, sans-serif;
            color: #e2e8f0;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            position: relative;
            z-index: 1;
        }

        .container {
            background-color: #2d3748;
            width: 100%;
            max-width: 400px;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        h1 {
            text-align: center;
            font-size: 24px;
            font-weight: bold;
            margin-bottom: 20px;
        }

        .otp-inputs {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 20px;
        }

        .otp-input {
            width: 50px;
            height: 50px;
            text-align: center;
            font-size: 24px;
            background-color: #4a5568;
            color: #e2e8f0;
            border: 1px solid #4a5568;
            border-radius: 4px;
            outline: none;
        }

        .otp-input:focus {
            border-color: #3182ce;
        }

        .submit-btn {
            width: 100%;
            padding: 12px;
            background-color: #3182ce;
            color: #fff;
            border: none;
            border-radius: 4px;
            font-size: 16px;
            cursor: pointer;
        }

        .submit-btn:hover {
            background-color: #2b6cb0;
        }

        .center-text {
            text-align: center;
            font-size: 14px;
            color: #a0aec0;
            margin-top: 20px;
        }

        .resend-text {
            text-align: center;
            font-size: 14px;
            color: #3182ce;
            cursor: pointer;
            margin-top: 10px;
        }
        a{
            color: white;
        }

        .error-message {
            color: red;
            font-size: 16px;
            text-align: center;
            margin-top: 20px;
        }

        .hidden {
            display: none;
        }
        `;
    }

    get template() {
        return /*html*/`
        <div class="container">
            <h1>Enter OTP</h1>
            
            <form id="otp_form">
                <div class="otp-inputs">
                    <input id="otp1" type="text" class="otp-input" maxlength="1" required>
                    <input id="otp2" type="text" class="otp-input" maxlength="1" required>
                    <input id="otp3" type="text" class="otp-input" maxlength="1" required>
                    <input id="otp4" type="text" class="otp-input" maxlength="1" required>
                    <input id="otp5" type="text" class="otp-input" maxlength="1" required>
                    <input id="otp6" type="text" class="otp-input" maxlength="1" required>
                </div>
                
                <button id="submit_button" type="submit" class="submit-btn">Verify OTP</button>
            </form>

            <div id="successMessage" class="success-message hidden">
                <p>OTP verified successfully!</p>
            </div>

            <div id="errorMessage" class="error-message hidden">
                <p>Invalid OTP. Please try again.</p>
            </div>

            <div class="resend-text" id="resend_otp">
                <p>Didn't receive an OTP? <a id="resend_link" href="#">Resend OTP</a></p> 
            </div>
        </div>
        `;
    }


    //== OnConnected =============================================================================
    onConnected() {
        const submitButton = this.shadowRoot.getElementById("otp_form");
        const resendLink = this.shadowRoot.getElementById("resend_link");

        this.addEventListener(resendLink, 'click', async (event) => {
            event.preventDefault();
            resendLink.style.pointerEvents = "none";
            resendLink.style.color = "gray";

            await handleResendOTP.bind(this)();
            resendLink.style.pointerEvents = "auto";
            resendLink.style.color = "white";

        })

        this.addEventListener(submitButton, 'submit', async (event) =>
        {
            event.preventDefault(); 
            const otp = Array.from({ length: 6 }, (_, i) => this.shadowRoot.querySelector(`#otp${i + 1}`).value).join('');
            await handleSendOTP(otp)
        });
    }

    showSuccessMessage() { //to see later if realy needed
        this.shadowRoot.querySelector('#successMessage').classList.remove('hidden');
        this.shadowRoot.querySelector('#errorMessage').classList.add('hidden');
    }

    showErrorMessage() { // to be removed after if not needed
        this.shadowRoot.querySelector('#errorMessage').classList.remove('hidden');
        this.shadowRoot.querySelector('#successMessage').classList.add('hidden');
    }
}


async function handleSendOTP(otp) {

    console.log("otp", otp)
    const response = await fetch("http://127.0.0.1:8080/auth/2fa/verify", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            otp
        })
    });
    if (response.ok){
        console.log("success");
    }
    else{
        error = await response.json()
        console.log(error["error"])
    }
}


async function handleResendOTP() {
    fetch("http://127.0.0.1:8080/auth/2fa/resend", {
        method: "GET",
    })
    .then(response => response.json()
    .then(data => {
        if (data["error"]){
            console.log(data["error"][0])
        }
        else{
            console.log("success");
            const accessToken = data["access"]
            console.log(accessToken)
        }
    }))
    .catch(error => 
        {
            console.error(error);
        });
}
