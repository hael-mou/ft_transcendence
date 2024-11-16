
/*=== global variables : =====================================================*/
let accessToken = null;


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
async function request(method, url, headers = {}, data = {})
{
    const response = await fetch(url, {
        method: method,
        headers: headers,
        body: data,
        credentials: 'include',
    });

    return await response.json();
}
