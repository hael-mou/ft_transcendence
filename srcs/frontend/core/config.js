
/* === domain : ============================================================ */
const backendUrl = 'http://127.0.0.1:8000';


/* === authentication : ==================================================== */
const authUrl = `${backendUrl}/auth`;

export const AuthGateway = {

    googleUrl :     `${authUrl}/social_auth/google`,
    intraUrl  :     `${authUrl}/social_auth/42`,
    emailUrl  :     `${authUrl}/signup`,
}
