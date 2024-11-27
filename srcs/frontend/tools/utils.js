
import { Router } from "../core/routing.js";
import { isConnected } from "./http.js";

/* ************************************************************************** */
/*   * utils :                                                                */
/* ************************************************************************** */
export const utils = {

    /* === redirectIfNotConnected : ========================================= */
    async redirectIfNotConnected(path) {
        const is_connected = await isConnected();
        if (!is_connected) Router.redirect(path);
    },

    /* === redirectIfConnected : ============================================ */
    async redirectIfConnected(path) {
        const is_connected = await isConnected();
        if (is_connected) Router.redirect(path);
    },

    /* === clear : ========================================================== */
    clear(element) {
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    },

    /* === validateEmail : ================================================== */
    validateEmail(email) {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    },

    /* === validatePassword : =============================================== */
    validatePassword(password) {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }
}
