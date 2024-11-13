
import { Component } from "../core/component.js";

/* *************************************************************************** #
#   *Reset Password Class :                                                    #
# *************************************************************************** */

export class ResetPassword extends Component
{
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

        .input-field {
            width: 93.5%;
            padding: 12px;
            margin: 10px 0;
            border-radius: 4px;
            border: 1px solid #4a5568;
            background-color: #4a5568;
            color: #e2e8f0;
            font-size: 16px;
        }

        .input-field:focus {
            border-color: #3182ce;
            outline: none;
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
            margin-top: 10px;
        }

        .submit-btn:hover {
            background-color: #2b6cb0;
        }
        .success-message {
            color: #38a169;
            font-size: 16px;
            text-align: center;
            margin-top: 20px;
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
            <h1>Enter your email , to send a verification link</h1>
            
            <form id="reset_form">

                <input id="email_input" type="email" placeholder="Email" class="input-field" required>
                <button id="submit_button" type="submit" class="submit-btn">Send Verification email</button>
            </form>
            <div id="successMessage" class="success-message hidden">
                <p>We've sent a verification link to your email. Please check your inbox!</p>
            </div>
            <div id= "errorMessage" class="error-message hidden">
            </div>
        </div>
        `; 
    }


    /* === onConnected : ========================================================== */
    onConnected(){
        const submitButton = this.shadowRoot.getElementById("reset_form");

        this.addEventListener(submitButton, 'submit', async (event) =>
        {
            event.preventDefault(); 
            const email = this.shadowRoot.getElementById("email_input").value;
            const res = await handleResetPassword(email);
            if (res === "success"){
                const successMessage = this.shadowRoot.getElementById("successMessage");
                successMessage.classList.remove("hidden");
            }
            else{
                // not tested yet
                const errorMessage = this.shadowRoot.getElementById("errorMessage");
                errorMessage.classList.remove("hidden");
                errorMessage.innerHTML  = `<p>${res}</p>`
                // to be changed later with customized error message
            }
        });
    }
}

async function handleResetPassword(email)
{
    const response = await fetch('http://127.0.0.1:8080/auth/reset', {
        method: "POST",
        headers:{
            "Content-Type" : "application/json"
        },
        body: JSON.stringify({
            email
        }),
    });
    const responseText = await response.text();
    
    if (response.ok) {
        const data = JSON.parse(responseText);
        console.log(data)
        const uidb64 = data["uidb64"];
        console.log(uidb64);
        const token = data["token"];
        console.log(token)

        // khass 7mza ystori hadxi fxi 9ont bax n9dr nsifto mn b3d f set new password
    } else {
        console.error("Error:", responseText);
    }
}

