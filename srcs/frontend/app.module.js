
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";

import { AuthApp } from "./components/authentication/base_page.js";
import { SignUp } from "./components/authentication/sign_up/app.sign_up.js";

import { BaseApp } from "./components/website/base_page.js";
import { ChatApp } from "./components/website/chat/chat_app.js";

/* === Custom Elements : ==================================================== */
customElements.define('auth-app', AuthApp);
customElements.define('sign-up', SignUp);
customElements.define('base-app', BaseApp);
customElements.define('chat-app', ChatApp);


/* === DOMContentLoaded : =================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    Router.setRoutes(appRoutes);
    await Router.initialize();
});
