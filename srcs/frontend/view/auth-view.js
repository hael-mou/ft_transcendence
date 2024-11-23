
import { utils as _ } from "../tools/utils.js";
// import { Router } from "../core/routing.js";

/* === rootView : =========================================================== */
export async function rootView()
{
    // 1. if ths user is connected, redirect to the home page
    // 2. if the user is not connected, redirect to the sign-in page
}

/* === signUpView : ========================================================= */
export async function signUpView()
{
    // 1. if the user is connected, redirect to the home page
    const appRoot    = document.querySelector('app-root');
    let   authApp    = appRoot?.querySelector('auth-app');
    const signUpForm = authApp?.querySelector('sign-up-form');

    if (signUpForm) return;
    if (!authApp) authApp = document.createElement('auth-app');
    _.clear(authApp);
    authApp.appendChild(document.createElement('sign-up-form'));
    appRoot.appendChild(authApp);
    authApp.setPadding("50px 139px");
}

/* === signInView : ========================================================= */
export async function signInView()
{
    // 1. if the user is connected, redirect to the home page
    const appRoot    = document.querySelector('app-root');
    let   authApp    = appRoot?.querySelector('auth-app');
    const signInForm = authApp?.querySelector('sign-in-form');

    if (signInForm) return;
    if (!authApp) authApp = document.createElement('auth-app');
    _.clear(authApp);
    authApp.appendChild(document.createElement('sign-in-form'));
    appRoot.appendChild(authApp);
    authApp.setPadding("37px 199px");
}

/* === completeView : ======================================================= */
export async function completeView()
{
    // 1. if the user is connected, redirect to the home page
    const appRoot    = document.querySelector('app-root');
    let   authApp    = appRoot?.querySelector('auth-app');
    const completeForm = authApp?.querySelector('complete-form');

    if (completeForm) return;
    if (!authApp) authApp = document.createElement('auth-app');
    _.clear(authApp);
    authApp.appendChild(document.createElement('complete-form'));
    appRoot.appendChild(authApp);
    authApp.setPadding("76px 96px");
}

/* === set new Password View : ============================================== */
export async function setNewPasswordView()
{
    // 1. if the user is connected, redirect to the home page
    const appRoot    = document.querySelector('app-root');
    let   authApp    = appRoot?.querySelector('auth-app');
    const setNewPasswordForm = authApp?.querySelector('set-new-password');

    if (setNewPasswordForm) return;
    if (!authApp) authApp = document.createElement('auth-app');
    _.clear(authApp);
    authApp.appendChild(document.createElement('set-new-password'));
    appRoot.appendChild(authApp);
    authApp.setPadding("75px 74px");
}
