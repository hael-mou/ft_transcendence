
import { signUpView, signInView, completeSignUpView } from "./view/auth-view.js";
import { resetPasswordView, setNewPasswordView } from "./view/auth-view.js";
import { profileView } from "./view/profile-view.js";
import { rootView } from "./view/base-view.js";

export const appRoutes = [
    /* auth path : ========================================================== */
    { path: '/', view: rootView },
    { path: '/sign-in', view: signInView },
    { path: '/sign-up', view: signUpView },
    { path: '/complete-sign-up', view: completeSignUpView },
    { path: '/reset-password', view: resetPasswordView },
    { path: '/set-new-password', view: setNewPasswordView },

    /* website path : ======================================================= */
    { path: '/profile', view: profileView },
]
