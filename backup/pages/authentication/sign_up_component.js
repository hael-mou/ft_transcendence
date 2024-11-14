
import { backendGateway } from "../../core/config.js";
import { Component } from "../../core/component.js";
import { Http } from "../../core/http.js";
import { _ } from "../../core/utils.js";

/* *************************************************************************** #
#   * AuthApp page Class :                                                     #
# *************************************************************************** */
export class SignUpComponent extends Component
{

    /* === template : ======================================================= */
    get template()
    {
        return /* html */ `
        <form id="sign_up_form">
            <div class="auth-buttons">
                <button id="google" type="button" class="auth-btn google">Sign up with Google</button>
                <button id="intra" type="button" class="auth-btn intra">Sign up with 42</button>
            </div>

            <input id="email_input" type="email" placeholder="Email" class="input-field" required>
            <button id="sumit_button" type="button" class="submit-btn">Sign up</button>
        </form>
        `;
    }


    /* === styles : ========================================================= */
    get styles()
    {
        return /*css*/`
            :host {
                display: block;
                width: 100%;
                height: 100%;
                font-family: Arial, sans-serif;
            }

            #sign_up_form {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                height: 100%;
                padding: 20px;
                box-sizing: border-box;
            }
        `;
    }

    /* === onConnected : ==================================================== */
    onConnected()
    {
        const google_button = this.shadowRoot.getElementById('google');
        const intra_button = this.shadowRoot.getElementById('intra');
        const sumit_button = this.shadowRoot.getElementById('sumit_button');

        this.addEventListener(google_button,'click', google_callback);
        this.addEventListener(intra_button,'click', intra_callback);
        this.addEventListener(sumit_button,'click', email_callback.bind(this));
    }
}


/* *************************************************************************** #
#   * Event callbacks :                                                        #
# *************************************************************************** */

/* === google_callback : ==================================================== */
function google_callback(event)
{
    event.preventDefault();
    window.location.href = backendGateway.googleAuthUrl;
}


/* === intra_callback : ==================================================== */
function intra_callback(event)
{
    event.preventDefault();
    window.location.href = backendGateway.intraAuthUrl;
}


/* === email_callback : ==================================================== */
async function email_callback(event) /* clean this function later */
{
    event.preventDefault();
    const emailInput = this.shadowRoot.getElementById('email_input');
    const email = emailInput.value;

    if (!_.validateEmail(email))
        return alert("Email sent"); //modifier in style

    const url = backendGateway.emailSignUpUrl;
    const headers = { 'Content-Type': 'application/json' };
    const data = JSON.stringify({ email });

    const response = await Http.post(url, headers, data);

    if (response.error)
        return alert(response.error);

    alert("Email sent");
}
