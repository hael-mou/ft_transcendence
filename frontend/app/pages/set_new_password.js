
import { Component } from "../core/component.js";

/* *************************************************************************** #
#   *Set New Password Class :                                                  #
# *************************************************************************** */

export class SetNewPassword extends Component
{
    get styles() {
        return /*css*/`

        :host {
            font-family: Arial, sans-serif;
            background-color: #1a202c;
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
            <h1>set new password</h1>
            
            <form id="set-new-password-form">

                <input id="password-input" type="password" placeholder="your new password" class="input-field" required>
                <input id="password-input-confirm" type="password" placeholder="confirm your new password" class="input-field" required>
                <button id="submit_button" type="submit" class="submit-btn">save</button>
            </form>
            <div id= "errorMessage" class="error-message hidden">
            </div>
        </div>
        `; 
    }


    //== onConnected =========================================================================

    onConnected(){
        const submitButton = this.shadowRoot.getElementById("set-new-password-form");

        this.addEventListener(submitButton, "submit", setNewPassword.bind(this));
    }
}

async function setNewPassword(){
    const errorMessage = this.shadowRoot.getElementById(errorMessage);
    const password1 = this.shadowRoot.getElementById("password-input").value;
    const password2 = this.shadowRoot.getElementById("password-input-confirm").value;

    if (validatePasswords(password1, password2)){

        const response = await fetch("http://127.0.0.1:8080/auth/set-new-password",{
            method: "POST", 
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                password1,
                token, 
                uidb64
            }),
        })    
        if (response.ok) {
            // Back to login page again to login with new password 

        } else {
            const error = await response.json();
            errorMessage.classList.remove("hidden");
            errorMessage.innerHTML = `<p>${error["error"]}</p>`;
            // had error nxouf m3aa hmza xi method 7ssan mn hadi
        
        }
    }
}


function validatePasswords(password1, password2)
{
    if (password1 < 8){
        alert("Passord must contain more that 8 characther")
        return false
    }
    if (password1 !== password2){   
        alert("Passwords didn't match")
        return false
    }
    if (!/[a-z]/.test(password1) || !/[A-Z]/.test(password1) || !/[0-9]/.test(password1)) {
        alert('Password must contain at least one lowercase letter, one uppercase letter, and one number');
        return false
    }
}