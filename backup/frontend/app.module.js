
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";
import { wsm } from "./core/wsManager.js";

import { AuthApp } from "./components/authentication/base_page.js";
import { SignUp } from "./components/authentication/sign_up/app.sign_up.js";

import { ChatApp } from "./components/website/chat/chat_app.js";

/* === Custom Elements : ==================================================== */

customElements.define('auth-app', AuthApp);
customElements.define('base-app', BaseApp);
customElements.define('chat-app', ChatApp);


/* === DOMContentLoaded : =================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    Router.setRoutes(appRoutes);
    wsm.url = "ws://127.0.0.1:8000/ws/chat";
    wsm.connect();
    await Router.initialize();
});