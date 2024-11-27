
import { utils as _ } from "../tools/utils.js";
import { Router } from "../core/routing.js";
import { getUserId } from "../tools/http.js";

/* === renderAuthView : ====================================================== */
async function renderAuthView(formName) {

    if (!Router.isRedirect) _.redirectIfConnected('/profile');

    const appRoot = document.querySelector('app-root');
    let   authApp = appRoot.querySelector('auth-app');

    if (!authApp) {
        _.clear(appRoot);
        authApp = document.createElement('auth-app');
    }

    if (!authApp.querySelector(formName)) {
        _.clear(authApp);
        authApp.appendChild(document.createElement(formName));
        appRoot.appendChild(authApp);
    }
}

/* === signUpView : ========================================================= */
export async function signUpView() {
    await renderAuthView('sign-up-form');
}

/* === signInView : ========================================================= */
export async function signInView() {
    await renderAuthView('sign-in-form');
}

/* === completeView : ======================================================= */
export async function completeView() {
    await renderAuthView('complete-form');
}

/* === setNewPasswordView : ================================================= */
export async function setNewPasswordView() {
    await renderAuthView('set-new-password');
}

/* === resetPasswordView : ================================================== */
export async function resetPasswordView() {
    await renderAuthView('reset-password');
}
