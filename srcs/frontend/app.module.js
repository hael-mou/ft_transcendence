
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";
import { wsm } from "./core/wsManager.js";

import { AuthApp } from "./components/authentication/base_page.js";
import { SignUp } from "./components/authentication/sign_up/app.sign_up.js";

import { ChatApp } from "./components/website/chat/chat_app.js";
import { UserCard } from "./components/website/chat/user_card.js";
import { ChatWindow } from "./components/website/chat/chat_window.js";
import { MessageCard } from "./components/website/chat/message_card.js";

import { BaseApp } from "./components/website/base_page.js";

/* === Custom Elements : ==================================================== */
customElements.define('auth-app', AuthApp);
customElements.define('sign-up', SignUp);
customElements.define('base-app', BaseApp);
customElements.define('chat-app', ChatApp);
customElements.define('user-card', UserCard);
customElements.define('chat-window', ChatWindow);
customElements.define('message-card', MessageCard);

/* === DOMContentLoaded : =================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    Router.setRoutes(appRoutes);
    wsm.url = "ws://127.0.0.1:8000/ws/chat";
    wsm.connect();
    await Router.initialize();
});
