
import { authGateway } from "../core/config.js";

/* ************************************************************************** */
/*    * variables :                                                           */
/* ************************************************************************** */
let accessToken = null;
let userId = null;

/* ************************************************************************** */
/*    * functions :                                                           */
/* ************************************************************************** */

/* === get User Id : ======================================================== */
export async function getUserId() {

    if (userId) return userId;

    if (accessToken) {
        userId = jwt_decode(accessToken).user_id;
        return userId;
    }

    await getAccessToken();
    return userId;
}

/* === getAccessToken : ===================================================== */
export async function getAccessToken() {

    const response = await Http.get(authGateway.getTokenUrl);

    if (!response.info.ok) return undefined;

    accessToken = response.json.access;
    userId = jwt_decode(accessToken).user_id;
    return accessToken;
}

/* === isConnected : ======================================================= */
export async function isConnected() {

    if (!accessToken)
        return await getAccessToken();

    const decoded = jwt_decode(accessToken);
    if (decoded.exp < Date.now() / 1000) {
        accessToken = null;
        userId = null;
        return !!(await getAccessToken());
    }

    return true;
}

/* ************************************************************************** */
/*    * Http utils :                                                          */
/* ************************************************************************** */
export class Http
{
    /* === get : ============================================================ */
    static async get(url, headers = {})
    {
        return await request('GET', url, headers);
    }

    /* === post : =========================================================== */
    static async post(url, headers = {}, data = {})
    {
        return await request('POST', url, headers, data);
    }

    /* === patch : =========================================================== */
    static async patch(url, headers = {}, data = {})
    {
        return await request('PATCH', url, headers, data);
    }

    /* === getWithAuth : ==================================================== */
    static async getWithAuth(url, headers = {})
    {
    }

    /* === postWithAuth : =================================================== */
    static async postWithAuth(url, headers = {}, data = {})
    {
    }

}


/* ************************************************************************** */
/*    * private functions :                                                   */
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
