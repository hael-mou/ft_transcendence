
import { utils as _ } from "../tools/utils.js";
import { Router } from "../core/routing.js";
import { Auth } from "../tools/http.js";

/* === renderWebPage : ====================================================== */
async function renderContentPage(appTagName) {

    const appRoot = document.querySelector('app-root');
    let  basePage = appRoot.querySelector('base-page');

    if (!basePage) {
        _.clear(appRoot);
        basePage = document.createElement('base-page');
        appRoot.appendChild(basePage);
    }

    if (!basePage.querySelector(appTagName)) {
        _.clear(basePage);

        const loadingScreen = document.getElementById("loading-screen");
        loadingScreen.style.opacity = "1";

        basePage.appendChild(document.createElement(appTagName));
    }
}

/* === profileView : ======================================================== */
export async function profileView() {

    if (!Router.isRedirect && !(await Auth.isConnected())) {
        return await Router.redirect('/sign-in');
    }

    await renderContentPage('profile-app');
    const profileElement = document.querySelector('profile-app');
    const userId = _.getQueryParams().id || await Auth.getUserId();

    if (profileElement.userId !== userId) {
        await profileElement.reRender();
    }
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
