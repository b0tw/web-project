import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import { createContext, useContext, useEffect, useState } from 'react';
import AuthHandler from './entities/AuthHandler';
import Grade from './components/Grade';
import Login from './components/Login';
import NavbarMenu from './components/NavbarMenu';
import SignUp from './components/SignUp';
import User from './components/User';
import UsersTable from './components/UsersTable';
import Home from './components/Home';
import TeamsTable from './components/TeamsTable';
import Team from './components/Team';

function PrivateRoute({ useAuthHandler, children, ...rest }) {
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

  useEffect(_ => (async _ => await authHandler.checkSession())(), []);
  
  return (
    <div className="App">
      <authContext.Provider value={authHandler}>
        <Router>
          <NavbarMenu useAuthHandler={useAuthContext} />

          <Switch>
            <PrivateRoute exact path="/" useAuthHandler={useAuthContext}>
              <Home useAuthHandler={useAuthContext} />
            </PrivateRoute>
            <PrivateRoute exact path="/user/:username" useAuthHandler={useAuthContext}>
              <User useAuthHandler={useAuthContext} />
            </PrivateRoute>
            <PrivateRoute exact path="/grade" useAuthHandler={useAuthContext}>
              <Grade useAuthHandler={useAuthContext}></Grade>
            </PrivateRoute>
            <PrivateRoute exact path="/students" useAuthHandler={useAuthContext}>
              <UsersTable onlyStudents={true} useAuthHandler={useAuthContext} />
            </PrivateRoute>
            <PrivateRoute exact path="/professors" useAuthHandler={useAuthContext}>
              <UsersTable onlyProfessors={true} useAuthHandler={useAuthContext} />
            </PrivateRoute>
            <PrivateRoute exact path="/teams" useAuthHandler={useAuthContext}>
              <TeamsTable useAuthHandler={useAuthContext}></TeamsTable>
            </PrivateRoute>
            <PrivateRoute exact path="/teams/:teamId" useAuthHandler={useAuthContext}>
              <Team useAuthHandler={useAuthContext} />
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
