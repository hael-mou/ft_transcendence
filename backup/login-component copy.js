
import { Component } from "../core/component.js";

/* *************************************************************************** #
#   * AuthApp Component Class :                                                #
# *************************************************************************** */
export class LoginComponent extends Component
{

    /* === template : ================================================== */
    get template() {
        return /* html */ `
        <p class="one-way">Sign Up</p>
        <div class="container-form">

            <button  id="google" class="container-google">
                <img src="/static/assets/imgs/google_icon.svg">
                <span>SIGN UP WITH GOOGLE<span>
            </button>

            <button id="intra" class="intra">
                <i>42</i> SIGN UP WITH INTRA
            </button>

            <button id="email" class="container-email">
                <img src="/static/assets/imgs/email_icon.svg">
                <span>SIGN UP WITH EMAIL</span>
            </button>
        </div>

        <div class="container-help">
            <p>Forgot email or trouble signing in?
            <span>Get help.</span></p>
        </div>
        `;
    }


    /* === styles : ================================================== */
    get styles() {
        return /*css*/`
        :host
            {
                width: 75%;
                --main-color: #219494;
                --second-color: #011627;
                --intra: #161a19;
            }

            .one-way
            {
                color: white;
                margin-bottom: 20px;
                font-weight: bold;
                font-size: 1.3em;
                text-align: center;
            }

            .container-form
            {
                display: flex;
                flex-direction: column;
                justify-content: center;
                align-items: center;
                color: white;
            }

            .container-form button
            {
                margin-bottom: 10px;
                min-height: 60px;
                border-radius: 10px;
            }

            .container-google img
            {
                margin-right: 10px;
                width: 20px;
            }

            .container-google
            {
                display: flex;
                align-items: center;
                justify-content: center;
                width: 100%;
                color: var(--intra);
                padding: 0;
                background-color: white;
                border: 2px solid var(--second-color);
                font-weight: 700;
                font-size:1em;
                cursor: pointer;
                transition: 0.5s;
            }

            .container-google span
            {
                font-family: 'Exo2', sans-serif;
                font-weight: 750;
                font-size:1em;
            }

            .container-google:hover
            {
                background-color: rgb(216, 216, 216);
                border: 1px solid var(--main-color);
            }

            .intra
            {
                width: 100%;
                padding: 0;
                background-color: var(--intra);
                border: 1px solid white;
                color: white;
                font-family: 'Exo2', sans-serif;
                font-weight: 700;
                font-size:1em;
                cursor: pointer;
                transition: 0.5s all;
                padding-right: 20px ;
            }

            .intra i {
                font-weight: bold;
                font-size: 1.1em;
                margin-right: 11px;
                margin-left: 3px;
            }

            .intra:hover
            {
                background-color: #272c2b;
            }

            .container-email {
                display: flex;
                align-items: center;
                justify-content: center;
                font-family: 'Exo2', sans-serif;
                font-weight: 700;
                font-size:1em;
                color: white;
                background-color: var(--main-color);
                border: 1px solid white;
                width: 100%;
                cursor: pointer;
                transition: 0.5s all;
            }

            .container-email:hover
            {
                background-color: var(--second-color);

            }

            .container-email img
            {
                width: 20px;
                margin-right: 12px;
            }

            .container-email span
            {
                text-align: center;
                margin-right: 12px;
            }

            .container-help
            {
                color: white;
                margin-top: 30px;
                margin-bottom: 50px;
                text-align: center;

            }

            .container-help span
            {
                text-decoration: underline;
                cursor: pointer;
            }
        `
    }
}
