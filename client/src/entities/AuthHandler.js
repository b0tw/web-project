import ApiRequestHandler from "./ApiRequestHelper";

export default class AuthHandler
{
  _isMounted = true;

  constructor(state, setState)
  {
    this.requestHandler = new ApiRequestHandler();
    this.state = state;
    this.setState = setState;
  }
  
  async checkSession()
  {
    await this.requestHandler.head('/sessions/check-session', {
      headers: this.getAuthorizationHeader()
    }, resp => {
      if(resp.status !== 204)
      {
        this.setState({ username: '', token: null });
        localStorage.removeItem('user-state');
      }
    });
  }

  getUsername()
  {
    return this.state.username;
  }

  getToken()
  {
    return this.state.token;
  }

  getAuthorizationHeader()
  {
    return this.state.token ? { 'Authorization': `Bearer ${this.state.token}` } : null;
  }

  isAuthenticated()
  {
    return this.state.token != null;
  }

  async login(user, callback)
  {
    await this.requestHandler.post('/sessions/login', {
      body: user
    }, resp => {
      if(resp && resp.token)
      {
        localStorage.setItem('user-state', JSON.stringify({ username: user.username, token: resp.token }));
        this.setState({ username: user.username, token: resp.token });
      }
  
      if(callback)
        callback(resp);
    });
  }

  async logout(callback)
  {
    await this.requestHandler.get('/sessions/logout', {
      headers: this.getAuthorizationHeader()
    }, resp => {
      localStorage.removeItem('user-state');
      this.setState({ username: '', token: null });

      if(callback)
        callback(resp);
    });
  }
}
