
import { utils as _ } from "../tools/utils.js";
import { Router } from "../core/routing.js";
import { wsm } from "../core/wsManager.js";
import { Auth } from "../tools/http.js";

/* === renderWebPage : ====================================================== */
async function renderContentPage(appTagName) {

    await wsm.connect();

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

    if (!Router.isRedirect && !(await Auth.isConnected())) {
        return await Router.redirect('/sign-in');
    }

    await renderContentPage('ternements-app');
}

/* === chatView : =========================================================== */
export async function chatView() {

    if (!Router.isRedirect && !(await Auth.isConnected())) {
        return await Router.redirect('/sign-in');
    }

    await renderContentPage('chat-app');
}

/* === gameView : =========================================================== */
export async function gameView() {

    if (!Router.isRedirect && !(await Auth.isConnected())) {
        return await Router.redirect('/sign-in');
    }

    await renderContentPage('game-app');
}

/* === matchmakerView : ===================================================== */
export async function matchmakerView() {

    if (!Router.isRedirect && !(await Auth.isConnected())) {
        return await Router.redirect('/sign-in');
    }

    await renderContentPage('matchmaking-component');

}

/* === playingView : ======================================================== */
export async function playingView() {

    if (!Router.isRedirect && !(await Auth.isConnected())) {
        return await Router.redirect('/sign-in');
    }

    await renderContentPage('game-component');
}

/* === settingView : ======================================================== */
export async function settingsView() {

    if (!Router.isRedirect && !(await Auth.isConnected())) {
        return await Router.redirect('/sign-in');
    }

    await renderContentPage('settings-app');
}
