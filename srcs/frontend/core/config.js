
/* === domain : ============================================================ */
const backendUrl = 'http://127.0.0.1:8000';


/* === backendGateway : ==================================================== */
export const backendGateway = {
    // authentication :
    googleAuthUrl       : `${backendUrl}/social_auth/google`,
    intraAuthUrl        : `${backendUrl}/social_auth/42`,
    emailSignUpUrl      : `${backendUrl}/auth/signup`,


    // security :
    enable2FAUrl        : `${backendUrl}/auth/2fa/enable`,
    disable2FAUrl       : `${backendUrl}/auth/2fa/disable`,
    updatePasswordUrl   : `${backendUrl}/auth/change-password`,


    // Friends :
    getFriendsUrl           : `${backendUrl}/profiles/me?friends`,
    getReceivedRequestsUrl  : `${backendUrl}/profiles/me/friends/request?received`,
    getSentRequestsUrl      : `${backendUrl}/profiles/me/friends/request?sent`,
    addFriendRequestUrl     : `${backendUrl}/profiles/me/friends/request/`,
    acceptFriendRequestUrl  : `${backendUrl}/profiles/me/friends/accept/`,
    rejectFriendRequestUrl  : `${backendUrl}/profiles/me/friends/reject/`,
    cancelFriendRequestUrl  : `${backendUrl}/profiles/me/friends/cancel/`,
    removeFriendUrl         : `${backendUrl}/profiles/me/friends/delete/`,


    // profile 
    getProfileUrl       : `${backendUrl}/profiles/`,

    // matches :
    getMatchesHistoryUrl : `${backendUrl}/profiles/matches`,
};
