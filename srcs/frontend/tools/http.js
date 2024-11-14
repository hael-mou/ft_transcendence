
let accessToken = null;

export class Http
{
    static async get(url, headers = {})
    {
        return await request('GET', url, headers);
    }

    static async post(url, headers = {}, data = {})
    {
        return await request('POST', url, headers, data);
    }

    static async getWithAuth(url, headers = {})
    {
    }

    static async postWithAuth(url, headers = {}, data = {})
    {
    }

}

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
