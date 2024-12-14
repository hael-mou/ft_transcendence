
/* === domain : ============================================================= */
const backendUrl = 'https://127.0.0.1:8080';


/* === authentication : ===================================================== */
const authUrl = `${backendUrl}/auth`;

export const authGateway = {

    getTokenUrl         : `${authUrl}/get-token`,

    googleUrl           : `${authUrl}/social_auth/google`,
    intraUrl            : `${authUrl}/social_auth/42`,
    loginUrl            : `${authUrl}/login`,
    resendOtpUrl        : `${authUrl}/2fa/resend`,

    compliteSignUpUrl   : `${authUrl}/signup/complete`,
    signUpUrl           : `${authUrl}/signup`,

    resetPasswordUrl    : `${authUrl}/reset`,
    setNewPasswordUrl   : `${authUrl}/set-new-password`,

    changePasswordUrl   : `${authUrl}/change-password`,
    changeUsernameUrl   : `${authUrl}/change-username `,

    enable2FaUrl        : `${authUrl}/2fa/enable`,
    disable2FaUrl       : `${authUrl}/2fa/disable`,
    verify2FaUrl        : `${authUrl}/2fa/verify`,
    getQrCodeUrl        : `${authUrl}/2fa/qr`,
    resendOtpUrl        : `${authUrl}/2fa/resend`,
}

/* === Profile : ============================================================ */
const profileUrl = `${backendUrl}/profile`;

export const profileGateway = {

    // Friends
    getFriendsUrl           : `${profileUrl}/me?friends`,
    friendRequestUrl        : `${profileUrl}/me/friends/request/`,
    acceptFriendRequestUrl  : `${profileUrl}/me/friends/accept/`,
    rejectFriendRequestUrl  : `${profileUrl}/me/friends/reject/`,
    cancelFriendRequestUrl  : `${profileUrl}/me/friends/cancel/`,
    removeFriendUrl         : `${profileUrl}/me/friends/delete/`,

    // profile
    getProfileUrl           : `${profileUrl}/`,
    myProfileUrl            : `${profileUrl}/me`,

    // matches :
    getMatchesHistoryUrl    : `${profileUrl}/matches`,
}

/* === Chat : ================================================================ */
const chatUrl = `${backendUrl}/chat`;

export const chatGateway = {

    getRoomsUrl            : `${chatUrl}/get_rooms/`,
    getMessagesUrl         : `${chatUrl}/get_messages/`,
    unReadMsgsUrl          : `${chatUrl}/unread_messages/`,
    getUserStatusUrl       : `${chatUrl}/isConnected/`,
    blockUserUrl           : `${chatUrl}/block_rooms/`,
}
