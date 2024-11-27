
/* === domain : ============================================================ */
const backendUrl = 'https://127.0.0.1:8080';


/* === authentication : ==================================================== */
const authUrl = `${backendUrl}/auth`;

export const authGateway = {

    getTokenUrl : `${authUrl}/get-token`,

    googleUrl      : `${authUrl}/social_auth/google`,
    intraUrl       : `${authUrl}/social_auth/42`,
    loginUrl       : `${authUrl}/login`,

    compliteSignUpUrl : `${authUrl}/signup/complete`,
    signUpUrl  : `${authUrl}/signup`,

    resetPasswordUrl : `${authUrl}/reset`,
}
