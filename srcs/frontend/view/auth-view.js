
import { utils as _ } from "../tools/utils.js";
import { Router } from "../core/routing.js";
import { getUserId } from "../tools/http.js";

/* === renderAuthView : ====================================================== */
async function renderAuthView(formTagName) {

    if (!Router.isRedirect) _.redirectIfConnected(`/profile`);

    const appRoot = document.querySelector('app-root');
    const authApp = appRoot?.querySelector('auth-app')
                    ?? document.createElement('auth-app');
    const existingForm = authApp.querySelector(formTagName);

    if (existingForm) return;
    _.clear(authApp);
    authApp.appendChild(document.createElement(formTagName));
    appRoot.appendChild(authApp);
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
