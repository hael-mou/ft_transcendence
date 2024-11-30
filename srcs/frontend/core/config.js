
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
    setNewPasswordUrl : `${authUrl}/set-new-password`,

}

/* === Profile : =========================================================== */
const profileUrl = `${backendUrl}/profile`;

export const profileGateway = {

    // Friends
    getFriendsUrl           : `${profileUrl}/me?friends`,
    getReceivedRequestsUrl  : `${profileUrl}/me/friends/request?received`,
    getSentRequestsUrl      : `${profileUrl}/me/friends/request?sent`,
    addFriendRequestUrl     : `${profileUrl}/me/friends/request/`,
    acceptFriendRequestUrl  : `${profileUrl}/me/friends/accept/`,
    rejectFriendRequestUrl  : `${profileUrl}/me/friends/reject/`,
    cancelFriendRequestUrl  : `${profileUrl}/me/friends/cancel/`,
    removeFriendUrl         : `${profileUrl}/me/friends/delete/`,

    // profile
    getProfileUrl           : `${profileUrl}`,
    updateProfileUrl        : `${profileUrl}/me`,

    // matches :
    getMatchesHistoryUrl    : `${profileUrl}/matches`,
}
