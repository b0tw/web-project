export default class ApiRequestHandler
{
  constructor()
  {
    this.apiRoute = 'http://localhost:8080/api';
    this.headers = {
      'Content-Type': 'application/json'
    }
  }

  getHeaders(extraHeaders)
  {
    const headers = { ...this.headers, ...extraHeaders};

    return headers;
  }

  async get(route, { query, headers }, callback)
  {
    const resp = await fetch(`${this.apiRoute}${route}${query ? query : ''}`, {
      method: 'GET',
      headers: this.getHeaders(headers),
    });

    callback(resp.status === 204 ? { status: resp.status }  : { status: resp.status, ...await resp.json() });
  }

  async post(route, { query, body, headers }, callback)
  {
      const resp = await fetch(`${this.apiRoute}${route}${query ? query : ''}`, {
        method: 'POST',
        mode: 'cors',
        headers: this.getHeaders(headers),
        body: body ? JSON.stringify(body) : null
      });

    callback(resp.status === 204 ? { status: resp.status }  : { status: resp.status, ...await resp.json() });
  }

  async put(route, { query, body, headers }, callback)
  {
    const resp = await fetch(`${this.apiRoute}${route}${query ? query : ''}`, {
      method: 'PUT',
      headers: this.getHeaders(headers),
      body: body ? JSON.stringify(body) : null
    });

    callback(resp.status === 204 ? { status: resp.status }  : { status: resp.status, ...await resp.json() });
  }

  async delete(route, { query, headers }, callback)
  {
    const resp = await fetch(`${this.apiRoute}${route}${query ? query : ''}`, {
      method: 'DELETE',
      headers: this.getHeaders(headers),
    });

    callback(resp.status === 204 ? { status: resp.status }  : { status: resp.status, ...await resp.json() });
  }
}