import logo from './logo.svg';
import './App.css';
import {
  BrowserRouter as Router,
  Link,
  Switch,
  Redirect,
  Route,
} from 'react-router-dom';
import {
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  NavItem,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  UncontrolledDropdown,
} from 'reactstrap';
import { useState } from 'react';

function App() {
  const [isCollapsed, toggleCollapse] = useState(true);
  const [token, setAuthToken] = useState('');
  const toggle = () => toggleCollapse(!isCollapsed);

  return (
    <Router>
      <div className="App">
        <Navbar color="dark" dark expand="md">
          <NavbarBrand href="/" className="mr-auto">AnonGrading</NavbarBrand>
          <NavbarToggler onClick={toggle} className="mr-2" />
          <Collapse isOpen={!isCollapsed} navbar>
          { token.length > 0
          ? <Nav navbar className="mr-auto">
              <NavItem className="mx-2">
                <Link to="/">Home</Link>
              </NavItem>
              <UncontrolledDropdown nav inNavbar className="mx-2">
                <DropdownToggle nav caret>Grading</DropdownToggle>
                <DropdownMenu right className="bg-secondary">
                  <DropdownItem tag={Link} to="/students">Students</DropdownItem>
                  <DropdownItem tag={Link} to="/teams">Teams</DropdownItem>
                  <DropdownItem divider />
                  <DropdownItem tag={Link} to="/grade">Grade</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
              <NavItem className="mx-2">
                <Link to="/professors">Professors</Link>
              </NavItem>
            </Nav>
          : <Nav navbar className="mr-auto">
              <NavItem className="mx-2">
                <Link to="/sign-up">Sign up</Link>
              </NavItem>
              <NavItem className="mx-2">
                <Link to="/login">Login</Link>
              </NavItem>
            </Nav>}
          </Collapse>
        </Navbar>

        <Switch>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
