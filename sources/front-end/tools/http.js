
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

    /* === get AccessToken : ================================================ */
    static async getAccessToken() {

        if (accessToken) return accessToken;

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

        if (userId) return userId;

        if (accessToken) {
            userId = jwt_decode(accessToken).user_id;
            return userId;
        }

        await Auth.getAccessToken();
        return userId;
    }

    /* === isConnected : ==================================================== */
    static async isConnected() {

        if (!accessToken && status === 'loggedOut') return false;
        if (!accessToken) return !!(await Auth.getAccessToken());

        const decoded = jwt_decode(accessToken);
        if (decoded?.exp < Date.now() / 1000)
        {
            return !!(await Auth.getAccessToken());
        }

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
