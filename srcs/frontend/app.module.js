
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";

import { Alert } from "./components/alert_component.js";
import { BaseApp } from "./components/base_page.js";

import { ResetPassword } from "./components/authentication/sign_in/app.reset_new_password.js";
import { SetNewPassword } from "./components/authentication/sign_in/app.set_new_pasword.js";
import { CompleteSignUp } from "./components/authentication/sign_up/app.complete_singup.js";
import { SignUp } from "./components/authentication/sign_up/app.sign_up.js";
import { SignIn } from "./components/authentication/sign_in/app.sign_in.js";
import { AuthApp } from "./components/authentication/base_page.js";

import { Profile } from "./components/profile/app.pofile.js";
import { FriendCard } from "./components/profile/friend_card.js";
import { MatchCard } from "./components/profile/match_card.js";

/* === Custom Auth Elements : =============================================== */

customElements.define('set-new-password', SetNewPassword);
customElements.define('reset-password', ResetPassword);
customElements.define('complete-form', CompleteSignUp);
customElements.define('sign-up-form', SignUp);
customElements.define('sign-in-form', SignIn);
customElements.define('auth-app', AuthApp);

customElements.define('profile-app', Profile);
customElements.define('friend-card', FriendCard);
customElements.define('match-card', MatchCard);

customElements.define('custom-alert', Alert);
customElements.define('base-app', BaseApp);

/* === DOMContentLoaded : =================================================== */
document.addEventListener('DOMContentLoaded', async () => {
    Router.setRoutes(appRoutes);
    await Router.initialize();
});

/* === Loading Screen : ===================================================== */
window.onload = function() {
    const delay = Math.max(0, 2000 - performance.now());
    setTimeout(function() {
        const loadingScreen = document.getElementById('loading-screen');
        loadingScreen.style.opacity = 0;
        setTimeout(() => {
            loadingScreen.style.display = 'none';
        }, 1000);
    }, delay)
};
