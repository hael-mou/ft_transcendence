
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";

import { AuthApp } from "./components/authentication/base_page.js";
import { SignUp } from "./components/authentication/sign_up/app.sign_up.js";

import { BaseApp } from "./components/website/base_page.js";
import { ChatApp } from "./components/website/chat/chat_app.js";

import { SignIn } from "./components/authentication/sign_in/app.sign_in.js";
import { CompleteSignUp } from "./components/authentication/sign_up/app.complete_singup.js";
import { ResetPassword } from "./components/authentication/sign_in/app.reset_new_password.js";
import { SetNewPassword } from "./components/authentication/sign_in/app.set_new_pasword.js";
import { Settings } from "./components/website/settings/app.settings.js";
import {  SecuritySettings } from "./components/website/settings/app.security.js";
import {Profile } from "./components/website/profile/app.pofile.js";
import { FriendCard } from "./components/website/profile/friend_card.js";
import { MatchCard } from "./components/website/profile/match_card.js";

/* === Custom Elements : ==================================================== */

customElements.define('auth-app', AuthApp);
customElements.define('base-app', BaseApp);
customElements.define('chat-app', ChatApp);

//Auth
customElements.define('sign-up', SignUp);
customElements.define('sign-in', SignIn);
customElements.define('complete-sign-up', CompleteSignUp);
customElements.define('reset-password', ResetPassword);
customElements.define('set-new-password', SetNewPassword);

// Settings
customElements.define('settings-app', Settings);
customElements.define('security-settings', SecuritySettings);

// Profile and its components
customElements.define('profile-app', Profile);
customElements.define('friend-card', FriendCard);
customElements.define('match-card', MatchCard);
/* === DOMContentLoaded : =================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    Router.setRoutes(appRoutes);
    await Router.initialize();
});
