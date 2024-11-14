import { Component } from "../core/component.js";

export class LoginComponent extends Component {
  get template() {
    return /* html */ `
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

  get styles() {
    return /*css*/`
      :host {
        width: 100%;
        --primary-color: #219494;
        --secondary-color: #011627;

        --text-color: #e6f1ff;
        --button-hover-color: #1d7e7e;
      }

      .title {
        color: var(--text-color);
        margin-bottom: 30px;
        font-weight: bold;
        font-size: 1.5em;
        text-align: center;
      }

      .container-form {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 15px;
      }

      .btn {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 100%;
        min-height: 50px;
        border-radius: 25px;
        font-family: 'Arial', sans-serif;
        font-weight: 600;
        font-size: 1em;
        cursor: pointer;
        transition: all 0.3s ease;
        border: none;
        padding: 0 20px;
      }

      .btn img {
        width: 20px;
        margin-right: 10px;
      }

      .btn-google {
        background-color: #ffffff;
        color: var(--secondary-color);
      }

      .btn-google:hover {
        background-color: #f1f1f1;
      }

      .btn-intra {
        background-color: var(--secondary-color);
        color: var(--text-color);
      }

      .btn-intra:hover {
        background-color: #022b50;
      }

      .intra-icon {
        font-weight: bold;
        font-size: 1.1em;
        margin-right: 10px;
      }

      .btn-email {
        background-color: var(--primary-color);
        color: var(--text-color);
      }

      .btn-email:hover {
        background-color: var(--button-hover-color);
      }

      .container-help {
        color: var(--text-color);
        margin-top: 30px;
        text-align: center;
      }

      .help-link {
        color: var(--primary-color);
        text-decoration: underline;
        cursor: pointer;
        transition: color 0.3s ease;
      }

      .help-link:hover {
        color: var(--button-hover-color);
      }

      @media (max-width: 768px) {
        .btn {
          font-size: 0.9em;
        }
      }

      @media (prefers-reduced-motion: reduce) {
        .btn, .help-link {
          transition: none;
        }
      }
    `;
  }

  onConnected() {
    this.addEventListeners();
  }

  addEventListeners() {
    const buttons = this.shadowRoot.querySelectorAll('.btn');
    buttons.forEach(button => {
      button.addEventListener('click', (e) => this.handleButtonClick(e));
    });

    const helpLink = this.shadowRoot.querySelector('.help-link');
    helpLink.addEventListener('click', (e) => this.handleHelpClick(e));
  }

  handleButtonClick(e) {
    const buttonId = e.currentTarget.id;
    console.log(`${buttonId} button clicked`);
    // Implement sign-up logic here
  }

  handleHelpClick(e) {
    e.preventDefault();
    console.log('Help link clicked');
    // Implement help functionality here
  }
}
