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

  getUsername()
  {
    return this.state.username;
  }

  getToken()
  {
    return this.state.token;
  }

  getAthorizationHeader()
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
      headers: this.getAthorizationHeader()
    }, resp => {
      localStorage.removeItem('user-state');
      this.setState({ username: '', token: null });

      if(callback)
        callback(resp);
    });
  }
}