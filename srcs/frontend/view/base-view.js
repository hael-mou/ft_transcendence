
import { utils as _ } from "../tools/utils.js";
import { getUserId } from "../tools/http.js";
import { Router } from "../core/routing.js";

/* === rootView : =========================================================== */
export async function rootView() {

    const rootapp = document.querySelector('app-root');
    _.clear(rootapp);

    _.redirectIfNotConnected('/sign-in');
    // Router.redirect(`/profile`);
}


/* === renderWebPage : ====================================================== */
export async function renderContentPage(formTagName) {

    if (!Router.isRedirect) _.redirectIfNotConnected(`/sign-in`);

    const appRoot = document.querySelector('app-root');
    let   baseApp = appRoot.querySelector('base-app');

    if (!baseApp) {
        _.clear(appRoot);
        baseApp = document.createElement('base-app');
    }

    if (!baseApp.querySelector(formTagName)) {
        _.clear(baseApp);
        // baseApp.appendChild(document.createElement(formTagName));
        appRoot.appendChild(baseApp);
    }
}
