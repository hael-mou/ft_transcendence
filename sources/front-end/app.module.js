
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";
import { utils } from "./tools/utils.js";

import { Alert } from "./components/custem-alert.js";
import { AuthPage } from "./components/page.auth.js";
import { BasePage } from "./components/base_page.js";

import { CompleteSignUp } from "./components/sign-up/complete-form.js";
import { SignUp } from "./components/sign-up/signup-form.js"

import { SetNewPassword } from "./components/sign-in/setNewPassword-form.js";
import { ResetPassword } from "./components/sign-in/resetPassword-form.js";
import { OtpVerification } from "./components/sign-in/otp-form.js";
import { SignIn } from "./components/sign-in/signin-form.js";

import { Settings } from "./components/settings/settings.js";
import { SecuritySettings } from "./components/settings/security_settings.js";

import { FriendCard } from "./components/profile/friend_card.js";
import { ProfileApp } from "./components/profile/profile_app.js";
import { MatchCard } from "./components/profile/match_card.js";

import { MessageCard } from "./components/chat/message_card.js";
import { InviteCard } from "./components/chat/invite_card.js";
import { ChatWindow } from "./components/chat/chat_window.js";
import { UserCard } from "./components/chat/user_card.js";
import { ChatApp } from "./components/chat/chat_app.js";

import gameComponent from "./components/game/gameComponent.js";
import matchMakinComponent from "./components/game/matchMakingComponent.js";
import { GameApp } from "./components/game/game_app.js";


/* === Custom Auth Elements : =============================================== */
customElements.define("custom-alert", Alert);
customElements.define("auth-page", AuthPage);
customElements.define("base-page", BasePage);

customElements.define("complete-form", CompleteSignUp);
customElements.define("sign-up-form", SignUp);

customElements.define("otp-verification-form", OtpVerification);
customElements.define("set-new-password-form", SetNewPassword);
customElements.define("reset-password-form", ResetPassword);
customElements.define("sign-in-form", SignIn);

customElements.define("match-card", MatchCard);
customElements.define("friend-card", FriendCard);
customElements.define("profile-app", ProfileApp);

customElements.define("settings-app", Settings);
customElements.define("security-settings", SecuritySettings);

customElements.define("message-card", MessageCard);
customElements.define("invite-card", InviteCard);
customElements.define("chat-window", ChatWindow);
customElements.define("user-card", UserCard);
customElements.define("chat-app", ChatApp);

customElements.define("matchmaking-component", matchMakinComponent);
customElements.define("game-component", gameComponent);
customElements.define("game-app", GameApp);

/* === Smooth appendChild : ================================================= */
const originalAppendChild = Element.prototype.appendChild;

Element.prototype.appendChild = async function (child, time = 0.5) {

    if (child instanceof HTMLElement) {

        child.style.opacity = 0;
        child.style.transition = `opacity ${time}s`;

        const result = originalAppendChild.call(this, child);

        setTimeout(() => {
            requestAnimationFrame(() => {
                child.style.opacity = 1;
            });
        }, 100);

        return result;
    }

    return originalAppendChild.call(this, child);
};

/* === DOM Content Loaded : ================================================= */
document.addEventListener("DOMContentLoaded", async () => {
    const rootElement = document.querySelector("app-root");
    utils.clear(rootElement);

    Router.setRoutes(appRoutes);
    await Router.initialize();
});


/* === load Route component : =============================================== */
window.addEventListener("load", () => {
    const loadingDelay = Math.max(0, 2000 - performance.now());
    setTimeout(() => {
        setTimeout(() => {
            const loadingScreen = document.getElementById("loading-screen");
            loadingScreen.style.opacity = "0";
            setTimeout(() => {
                loadingScreen.style.display = "none";
            }, 1000);
        }, 1000);
    }, loadingDelay);
});
