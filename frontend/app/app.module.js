
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";

import { AuthApp } from "./components/authentication/app.auth.js";
import { SignUp } from "./components/authentication/app.sign_up.js";


/* === Custom Elements : ==================================================== */
customElements.define('auth-app', AuthApp);
customElements.define('sign-up-app', SignUp);


/* === DOMContentLoaded : =================================================== */
document.addEventListener('DOMContentLoaded', () => {
    Router.setRoutes(appRoutes);
    Router.initialize();
});
