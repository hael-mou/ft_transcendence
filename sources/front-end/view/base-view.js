
import { utils as _ } from "../tools/utils.js";
import { Router } from "../core/routing.js";
import { Auth } from "../tools/http.js";

/* === rootView : =========================================================== */
export async function rootView() {

    const appRoot = document.querySelector('app-root');
    _.clear(appRoot);

    await Auth.isConnected()
        ? await Router.redirect('/profile')
        : await Router.redirect('/sign-in');
}
