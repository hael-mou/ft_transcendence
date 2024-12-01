
/* ************************************************************************** */
/*   * utils :                                                                */
/* ************************************************************************** */
export const utils = {

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
    },

    /* === getQueryParams : ================================================= */
    getQueryParams() {
        const urlParams = new URLSearchParams(window.location.search);
        return Object.fromEntries(urlParams.entries());
    }
}
