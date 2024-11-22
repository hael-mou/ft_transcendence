
/* ************************************************************************** */
/*   * utils :                                                                */
/* ************************************************************************** */
export default {

    /* === validateEmail : ================================================== */
    validateEmail(email)
    {
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailRegex.test(email);
    },

    validatePassword(password)
    {
        const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
        return passwordRegex.test(password);
    }
}
