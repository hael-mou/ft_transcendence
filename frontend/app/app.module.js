
import { appRoutes } from "./app.routes.js";
import { Router } from "./core/routing.js";

import { SignUp } from "./pages/sign_up.js";
import { CompleteSignUp } from "./pages/complete_singup.js";
import { SignIn } from "./pages/sign_in.js"
import { OTP } from "./pages/otp.js";
import { ResetPassword } from "./pages/reset_password.js"
import { SetNewPassword } from "./pages/set_new_password.js";
import { Settings } from "./pages/settings.js"

/* === Custom Elements : ==================================================== */
customElements.define('sign-up-app', SignUp);
customElements.define('complete-sign-up-app', CompleteSignUp);
customElements.define('sign-in-app', SignIn);
customElements.define('otp-app', OTP);
customElements.define("reset-password-app", ResetPassword)
customElements.define("set-new-password", SetNewPassword)
customElements.define("settings-app", Settings)

/* === DOMContentLoaded : =================================================== */
document.addEventListener('DOMContentLoaded', () => {
    Router.setRoutes(appRoutes);
    Router.initialize();
});
