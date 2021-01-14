import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import { createContext, useContext, useState } from 'react';
import AuthHandler from './entities/AuthHandler';
import NavbarMenu from './components/NavbarMenu';
import Login from './components/Login';
import SignUp from './components/SignUp';

function PrivateRoute({ useAuthHandler, children, ...rest })
{
  const authHandler = useAuthHandler();

  return (
    <Route {...rest}
      render={({ location }) =>
      authHandler.isAuthenticated() ? (
        children
      ) : (
        <Redirect to={{
          pathname: '/login',
          state: { from: location }
        }} />
      )} />
  );
}

const authContext = createContext();

function App() {
  const [userState, setUserState] = useState(JSON.parse(localStorage.getItem('user-state')) || { username: '', token: null });
  const authHandler = new AuthHandler(userState, setUserState);
  const useAuthContext = () => useContext(authContext);
  
  return (
    <div className="App">
      <authContext.Provider value={authHandler}>
        <Router>
          <NavbarMenu useAuthHandler={useAuthContext} />

          <Switch>
            <PrivateRoute exact path="/" useAuthHandler={useAuthContext}>
              <h1>Hello</h1>
            </PrivateRoute>
            
            <Route exact path="/login">
              <Login useAuthHandler={useAuthContext} />
            </Route>

            <Route exact path="/sign-up">
              <SignUp useAuthHandler={useAuthContext} />
            </Route>

            <Redirect path="*" to="/" />
          </Switch>
        </Router>
      </authContext.Provider>
    </div>
  );
}

export default App;
