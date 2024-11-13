
import { Component } from "../core/component.js";

/* *************************************************************************** #
#   * SignIn Class :                                                    #
# *************************************************************************** */

export class SignIn extends Component
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

        .center-text {
            text-align: center;
            font-size: 14px;
            color: #a0aec0;
            margin-top: 20px;
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
            background-color: #2b6cb0;
        }

        .auth-btn.intra {
            background-color: #38a169;
        }

        .auth-btn:hover {
            opacity: 0.9;
        }
        `;
    }

    get template() {
        return /*html*/`
        <div class="container">
            <h1>Hi there</h1>
            
            <form id="sign_in_form">
                <div class="auth-buttons">
                    <button id="google_button" type="button" class="auth-btn google">Sign in with Google</button>
                    <button id="intra_button" type="button" class="auth-btn intra">Sign in with 42</button>
                </div>

                <input id="email_input" type="email" placeholder="email" class="input-field" required>
                <input id="password_input" type="password" placeholder="password" class="input-field" required>
                <button id="sumit_button" type="submit" class="submit-btn">Sign in</button>
            </form>
        </div>
        `; 
    }


    /* === onConnected : ========================================================== */
    onConnected(){
        const googleButton = this.shadowRoot.getElementById("google_button");
        const intraButton = this.shadowRoot.getElementById("intra_button");
        const submitButton = this.shadowRoot.getElementById("sign_in_form");

        this.addEventListener(googleButton, 'click', signUpWithGoogle);
        this.addEventListener(intraButton, 'click', signUpWithIntra);

        this.addEventListener(submitButton, 'submit', async (event) => {
            event.preventDefault();

            const email = this.shadowRoot.getElementById("email_input").value.trim();
            const password = this.shadowRoot.getElementById("password_input").value;

            const response = await fetch('http://127.0.0.1:8080/auth/login', {
                method: "POST",
                headers:{
                    "Content-Type" : "application/json"
                },
                body: JSON.stringify({
                    email,
                    password
                }),
            });

            const responseText = await response.text();
    
            if (response.ok) {
                const data = JSON.parse(responseText);
                console.log(data)
                const accessToken = data["access"];
                console.log(accessToken);  
            } else {
                console.error("Error:", responseText);
            }
        });
    }
}


function signUpWithGoogle(event) {

    event.preventDefault();
    window.location.href = "http://127.0.0.1:8080/social_auth/google";
}


function signUpWithIntra(event) {
    event.preventDefault()
    window.location.href = "http://127.0.0.1:8080/social_auth/42";
}