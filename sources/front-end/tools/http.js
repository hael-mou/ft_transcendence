
import { authGateway } from "../core/config.js";

/* ************************************************************************** */
/*    * variables :                                                           */
/* ************************************************************************** */
let accessToken = undefined;
let userId = undefined;
let status = undefined;

/* ************************************************************************** */
/*    * auth :                                                                */
/* ************************************************************************** */
export class Auth {

    /* === has valid token : ================================================= */
    static hasValidToken() {

        if (!accessToken) return false;
        const decoded = jwt_decode(accessToken);
        if (!decoded || decoded.exp < (Date.now() / 1000) + 10) return false;
        return true;
    }


    /* === get AccessToken : ================================================ */
    static async getAccessToken() {

        if (Auth.hasValidToken()) return accessToken;

        const response = await Http.get(authGateway.getTokenUrl);
        if (!response.info.ok) {
            accessToken  = undefined;
            userId       = undefined;
            status       = 'loggedOut';
            return undefined;
        }

        accessToken = response.json.access;
        userId = jwt_decode(accessToken).user_id;
        status = 'loggedIn';
        return accessToken;
    }

    /* === get UserId : ===================================================== */
    static async getUserId() {

        if (status === 'loggedOut') return undefined;
        if (!Auth.hasValidToken()) await Auth.getAccessToken();
        return userId;
    }

    /* === isConnected : ==================================================== */
    static async isConnected() {

        if (status === 'loggedOut') return false;
        if (!Auth.hasValidToken()) return !!(await Auth.getAccessToken());
        return true;
    }
}

/* ************************************************************************** */
/*    * http :                                                                */
/* ************************************************************************** */
export class Http {

    /* === get : ============================================================ */
    static async get(url, headers = {}) {

        return await request('GET', url, headers);
    }

    /* === getwithAuth : ==================================================== */
    static async getwithAuth(url, headers = {}) {

        accessToken = await Auth.getAccessToken();
        headers['Authorization'] = `Bearer ${accessToken}`;
        return await request('GET', url, headers);
    }

    /* === post : =========================================================== */
    static async post(url, headers = {}, data) {

        return await request('POST', url, headers, data);
    }

    /* === postwithAuth : =================================================== */
    static async postwithAuth(url, headers = {}, data) {

        accessToken = await Auth.getAccessToken();
        headers['Authorization'] = `Bearer ${accessToken}`;
        return await request('POST', url, headers, data);
    }
    /* === patchwithAuth : ================================================== */
    static async patchwithAuth(url, headers = {}, data) {

        accessToken = await Auth.getAccessToken();
        headers['Authorization'] = `Bearer ${accessToken}`;
        return await request('PATCH', url, headers, data);
    }

    /* === put : ============================================================ */
    static async put(url, headers = {}, data) {

        return await request('PUT', url, headers, data);
    }

    /* === putwithAuth : ==================================================== */
    static async putwithAuth(url, headers = {}, data) {

        accessToken = await Auth.getAccessToken();
        headers['Authorization'] = `Bearer ${accessToken}`;
        return await request('PUT', url, headers, data);
    }

}


/* ************************************************************************** */
/*    * request :                                                             */
/* ************************************************************************** */
async function request(method, url, headers = {}, data) {

    const response = await fetch(url, {
        method,
        headers,
        body: data,
        credentials: 'include',
    });

    try {
        return { json: await response.json(), info: response };

    } catch (error) {
        return { json: null, info: response };
    }
}
