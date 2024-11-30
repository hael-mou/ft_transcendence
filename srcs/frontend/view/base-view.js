
import { utils as _ } from "../tools/utils.js";
import { getUserId, isConnected } from "../tools/http.js";
import { Router } from "../core/routing.js";

/* === rootView : =========================================================== */
export async function rootView() {
    const appRoot = document.querySelector('app-root');
    _.clear(appRoot);

    if (!Router.isRedirect && (await isConnected()))
        Router.redirect('/profile');
    else
        Router.redirect('/sign-in');
}


/* === renderWebPage : ====================================================== */
export async function renderContentPage(appTagName) {

    if (!Router.isRedirect && !(await isConnected())) {
        return Router.redirect('/sign-in');
    }

    const appRoot = document.querySelector('app-root');
    let  baseApp  = appRoot.querySelector('base-app');

    if (!baseApp) {
        _.clear(appRoot);
        baseApp = document.createElement('base-app');
        appRoot.appendChild(baseApp);
    }

    const app = baseApp.querySelector(appTagName);

    if (!app) {
        _.clear(baseApp);
        baseApp.appendChild(document.createElement(appTagName));
    }
}
