
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";

import { AuthApp } from "./components/authentication/base_page.js";
import { SignUp } from "./components/authentication/sign_up/app.sign_up.js";

/* === Custom Elements : ==================================================== */
customElements.define('auth-app', AuthApp);
customElements.define('sign-up', SignUp);


/* === DOMContentLoaded : =================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    Router.setRoutes(appRoutes);
    await Router.initialize();
});
