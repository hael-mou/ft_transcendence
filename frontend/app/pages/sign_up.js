
import { Component } from "../core/component.js";

/* *************************************************************************** #
#   * SignUp Class :                                                           #
# *************************************************************************** */

export class SignUp extends Component
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
            background-color: #01203a;
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
        .auth-buttons {
            display: flex;
            flex-direction: column;
            gap: 10px;
        }

        .auth-btn {
            width: 100%;
            padding: 12px;
            margin: 0;
            border-radius: 4px;
            color: #fff;
            font-size: 16px;
            cursor: pointer;
            border: none;
        }

        .auth-btn.google {
            background-color: #4285f4;
        }

        .auth-btn.intra {
            background-color: #00BABC;
        }

        .auth-btn:hover {
            opacity: 0.9;
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
            <h1>Sign Up</h1>
            
            <form id="sign_up_form">
                <div class="auth-buttons">
                    <button id="google_button" type="button" class="auth-btn google">Sign up with Google</button>
                    <button id="intra_button" type="button" class="auth-btn intra">Sign up with 42</button>
                </div>

                <input id="email_input" type="email" placeholder="Email" class="input-field" required>
                <button id="sumit_button" type="submit" class="submit-btn">Sign up</button>
            </form>
            <div id="successMessage" class="success-message hidden">
                <p>We've sent a verification link to your email. Please check your inbox!</p>
            </div>
                <div id="errorMessage" class="error-message hidden">
                <p></p>
            </div>
        </div>
        `; 
    }


    /* === onConnected : ========================================================== */
    onConnected(){
        const googleButton = this.shadowRoot.getElementById("google_button");
        const intraButton = this.shadowRoot.getElementById("intra_button");
        const submitButton = this.shadowRoot.getElementById("sign_up_form");
        const successMessage = this.shadowRoot.getElementById('successMessage');
        const errorMessage = this.shadowRoot.getElementById("errorMessage")

        
        this.addEventListener(googleButton, 'click', signUpWithGoogle);
        this.addEventListener(intraButton, 'click', signUpWithIntra);
        this.addEventListener(submitButton, 'submit', async (event) =>
        {
            event.preventDefault()
            const email = this.shadowRoot.getElementById("email_input").value.trim();
            console.log(email)
            if (validateEmail(email)){
                await handle_email_signp(email, successMessage, errorMessage) // to change this by bind or another method 
            }
            else 
                alert("Enter Valid Email")
        });
    }
}


/* === SignupWithGoogle : ===================================================== */

function signUpWithGoogle(event) {

    event.preventDefault();
    window.location.href = "http://127.0.0.1:8080/social_auth/google";
}


function signUpWithIntra(event) {
    event.preventDefault()
    window.location.href = "http://127.0.0.1:8080/social_auth/42";
}


function validateEmail(email)
{
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);   
}

async function handle_email_signp(email, successMessage, errorMessage) {

    const response = await fetch("http://127.0.0.1:8080/auth/signup", 
    {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email,
        })
    });

    if (response.ok){
        successMessage.classList.remove("hidden")
    }
    else{
        const error = response.json();
        errorMessage.innerHTML = `<p>${error["error"]}</p>`
    }
}