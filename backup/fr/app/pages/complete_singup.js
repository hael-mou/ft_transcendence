import { Component } from "../core/component.js";

/* *************************************************************************** #
#   * CompleteSignUp Class :                                              #
# *************************************************************************** */

export class CompleteSignUp extends Component {

    get styles() {
        return /*css*/`

        :host {
            font-family: Arial, sans-serif;;
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
            color: #e53e3e;
            font-size: 14px;
            text-align: center;
            margin-top: 20px;
        }

        .center-text {
            text-align: center;
            font-size: 14px;
            color: #a0aec0;
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
            <h1>Complete Sign Up</h1>
            
            <form id="complete_signup_form">
                <input id="username" type="text" placeholder="Username" class="input-field" required>
                <input id="password" type="password" placeholder="Password" class="input-field" required>
                <input id="confirm_password" type="password" placeholder="Confirm Password" class="input-field" required>
                <button id="completeSignUp" type="submit" class="submit-btn">Complete Sign Up</button>
            </form>
            <div id="errorMessage" class="error-message hidden">
                <p>Passwords do not match. Please try again.</p>
            </div>
        </div>
        `;
    }

    /* === onConnected : ========================================================== */

    onConnected() {
        const completeSignUpForm = this.shadowRoot.getElementById('complete_signup_form');
        const usernameInput = this.shadowRoot.getElementById('username');
        const passwordInput = this.shadowRoot.getElementById('password');
        const confirmPasswordInput = this.shadowRoot.getElementById('confirm_password');
        const errorMessage = this.shadowRoot.getElementById('errorMessage');

        this.addEventListener(completeSignUpForm, 'submit', async (event) => {
            event.preventDefault();
            const username = usernameInput.value.trim();
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (validatePasswords(password, confirmPassword)) {
                await handleCompleteSignUp(username, password);
            } else {
                errorMessage.classList.remove('hidden');
            }
        });
    }
}


function validatePasswords(password, confirmPassword) {
    if (password !== confirmPassword) {
        return false;
    }

    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return false;
    }

    if (!/[a-z]/.test(password) || !/[A-Z]/.test(password) || !/[0-9]/.test(password)) {
        alert('Password must contain at least one lowercase letter, one uppercase letter, and one number');
        return false;
    }

    return true;
}

async function handleCompleteSignUp(username, password) {

    const response = await fetch('http://127.0.0.1:8080/auth/signup/complete', {
        method: 'POST',
        credentials: 'include',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password
        })
    });
    const data = await response.json();
    if (response.ok){

        const accessToken = data["access"]
        console.log("Success Complete");
        // user go the home with storing the access token somewhere

    }
    else{
        console.log(data["error"][0]);
    }
}
