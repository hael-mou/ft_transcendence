
import { signUpView, signInView, completeSignUpView, verify2FaView } from "./view/auth-view.js";
import { resetPasswordView, setNewPasswordView } from "./view/auth-view.js";
import { gameView, chatView, settingsView } from "./view/internal-view.js";
import { profileView, ternementsView } from "./view/internal-view.js";
import { matchmakerView, playingView } from "./view/internal-view.js";
import { rootView } from "./view/base-view.js";

export const appRoutes = [
    /* auth path : ========================================================== */
    { path: '/', view: rootView },
    { path: '/sign-in', view: signInView },
    { path: '/sign-up', view: signUpView },
    { path: '/complete-sign-up', view: completeSignUpView },
    { path: '/reset-password', view: resetPasswordView },
    { path: '/set-new-password', view: setNewPasswordView },
    { path: '/verify-2fa', view: verify2FaView },

    /* internal path : ====================================================== */
    { path: '/profile', view: profileView },
    { path: '/tournaments', view: ternementsView },
    { path: '/chat', view: chatView },
    { path: '/settings', view: settingsView },
    { path: '/game', view: gameView },
    { path: '/game/matchmaker', view: matchmakerView },
    { path: '/game/playing', view: playingView },
]
