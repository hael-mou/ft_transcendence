
import { utils as _ } from "../tools/utils.js";
import { Router } from "../core/routing.js";
import { Auth } from "../tools/http.js";

/* === renderWebPage : ====================================================== */
async function renderContentPage(appTagName) {

    if (!Router.isRedirect && !(await Auth.isConnected())) {
        return await Router.redirect('/sign-in');
    }

    const appRoot = document.querySelector('app-root');
    let  basePage = appRoot.querySelector('base-page');

    if (!basePage) {
        _.clear(appRoot);
        basePage = document.createElement('base-page');
        appRoot.appendChild(basePage);
    }

    if (!basePage.querySelector(appTagName)) {
        _.clear(basePage);
        basePage.appendChild(document.createElement(appTagName));
    }
}

/* === profileView : ======================================================== */
export async function profileView() {

    await renderContentPage('profile-app');
}

/* === ternementsView : ===================================================== */
export async function ternementsView() {

    await renderContentPage('ternements-app');
}

/* === chatView : =========================================================== */
export async function chatView() {

    await renderContentPage('chat-app');
}

/* === gameView : =========================================================== */
export async function gameView() {

    await renderContentPage('game-app');
}

/* === settingView : ======================================================== */
export async function settingsView() {

    await renderContentPage('settings-app');
}
