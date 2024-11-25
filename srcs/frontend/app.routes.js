
import { completeView, signUpView, signInView } from "./view/auth-view.js";
import { setNewPasswordView } from "./view/auth-view.js";
import { resetPasswordView } from "./view/auth-view.js";
import { rootView } from "./view/auth-view.js";

export const appRoutes = [
    /* auth path : =========================================================== */
    { path: '/', view: rootView },
    { path: '/sign-up', view: signUpView },
    { path: '/sign-in', view: signInView },
    { path: '/complete-sign-up', view: completeView },
    { path: '/set-new-password', view: setNewPasswordView },
    { path: '/reset-password', view: resetPasswordView },

]
