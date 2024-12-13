
import { utils as _ } from "../tools/utils.js";
import { Router } from "../core/routing.js";
import { wsm } from "../core/wsManager.js";
import { Auth } from "../tools/http.js";

/* === renderAuthView : ====================================================== */
async function renderAuthView(formName) {

    if (!Router.isRedirect && (await Auth.isConnected())) {
        return await Router.redirect('/profile');
    }

    wsm.terminate();

    const appRoot  = document.querySelector('app-root');
    let   authPage = appRoot.querySelector('auth-page');

    if (!authPage) {
        _.clear(appRoot);
        authPage = document.createElement('auth-page');
        appRoot.appendChild(authPage);
    }

    if (!authPage.querySelector(formName)) {
        _.clear(authPage);
        authPage.appendChild(document.createElement(formName));
    }
}

/* === signUpView : ========================================================= */
export async function signUpView() {

    await renderAuthView('sign-up-form');
}

/* === completeSignUpView : ================================================= */
export async function completeSignUpView() {

    await renderAuthView('complete-form');
}


/* === signInView : ========================================================= */
export async function signInView() {

    await renderAuthView('sign-in-form');
}

/* === resetPasswordView : ================================================== */
export async function resetPasswordView() {

    await renderAuthView('reset-password-form');
}

/* === setNewPasswordView : ================================================= */
export async function setNewPasswordView() {

    await renderAuthView('set-new-password-form');
}

/* === verify2FaView : ======================================================= */
export async function verify2FaView() {
    await renderAuthView('otp-verification-form');
}
