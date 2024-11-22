
import { backendGateway } from "../../core/config.js";
import { Component } from "../../core/component.js";
import { Http } from "../../tools/http.js";
import { _ } from "../../tools/utils.js";

/* *************************************************************************** #
#   * AuthApp page Class :                                                     #
# *************************************************************************** */
export class SignInComponent extends Component
{

    /* === template : ======================================================= */
    get template() {
        return /*html*/`
        <form id="sign_in_form">
            <div class="auth-buttons">
                <button id="google" type="button" class="auth-btn google">Sign in with Google</button>
                <button id="intra" type="button" class="auth-btn intra">Sign in with 42</button>
            </div>

            <input id="email" type="email" placeholder="email" class="input-field" required>
            <input id="password" type="password" placeholder="password" class="input-field" required>
             <button id="sumit_button" type="button" class="submit-btn">Sign in</button>
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
                min-height: 100%;
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
        const submitButton = this.shadowRoot.getElementById("sumit_button");

        this.addEventListener(google_button,'click', google_callback);
        this.addEventListener(intra_button,'click', intra_callback);
        this.addEventListener(submitButton,'click', login_callback.bind(this));
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


/* === login_callback : ==================================================== */
async function login_callback(event)
{
    event.preventDefault();
    //to later
}
