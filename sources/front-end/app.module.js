
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";
import { utils } from "./tools/utils.js";

import { Alert } from "./components/custem-alert.js";
import { AuthPage } from "./components/page.auth.js";

import { CompleteSignUp } from "./components/sign-up/complete-form.js";
import { SignUp } from "./components/sign-up/signup-form.js"

import { SetNewPassword } from "./components/sign-in/setNewPassword-form.js";
import { ResetPassword } from "./components/sign-in/resetPassword-form.js";
import { SignIn } from "./components/sign-in/signin-form.js";


/* === Custom Auth Elements : =============================================== */
customElements.define("custom-alert", Alert);
customElements.define("auth-page", AuthPage);

customElements.define("complete-form", CompleteSignUp);
customElements.define("sign-up-form", SignUp);

customElements.define("set-new-password-form", SetNewPassword);
customElements.define("reset-password-form", ResetPassword);
customElements.define("sign-in-form", SignIn);



/* === Smooth appendChild : ================================================= */
const originalAppendChild = Element.prototype.appendChild;

Element.prototype.appendChild = function (child, time = 1.5) {

    if (child instanceof HTMLElement) {

        child.style.opacity = 0;
        child.style.transition = `opacity ${time}s`; ;

        const result = originalAppendChild.call(this, child);

        requestAnimationFrame(() => {
            child.style.opacity = 1;
        });

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
    const loadingDelay = Math.max(0, 1500 - performance.now());
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
