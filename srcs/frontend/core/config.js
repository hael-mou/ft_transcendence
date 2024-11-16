
/* === domain : ============================================================ */
const backendUrl = 'http://127.0.0.1:8000';


/* === backendGateway : ==================================================== */
export const backendGateway = {
    // authentication :
    googleAuthUrl   : `${backendUrl}/social_auth/google`,
    intraAuthUrl    : `${backendUrl}/social_auth/42`,
    emailSignUpUrl  : `${backendUrl}/auth/signup`,
};
