import React, { useState } from 'react';
import { Link } from 'react-router-dom';
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
import './NavbarMenu.css';

export default function NavbarMenu({ useAuthHandler })
{
  const [isCollapsed, toggleCollapse] = useState(true);
  const toggle = () => toggleCollapse(!isCollapsed);
  const authHandler = useAuthHandler();

  const logout = () => authHandler.logout();

  return (
    <Navbar color="dark" dark expand="md">
      <NavbarBrand href="/" className="mr-auto">AnonGrading</NavbarBrand>
      <NavbarToggler onClick={toggle} className="mr-2" />
      { authHandler.isAuthenticated()
      ? (<Collapse isOpen={!isCollapsed} navbar>
          <Nav navbar className="mr-auto">
            <NavItem className="mx-2">
              <Link to="/" className="text-light nav-link">Home</Link>
            </NavItem>
            <UncontrolledDropdown nav inNavbar className="mx-2">
              <DropdownToggle nav caret className="text-light">Grading</DropdownToggle>
              <DropdownMenu right className="bg-secondary">
                <DropdownItem tag={Link} to="/students" className="text-light dropdown-item-text-color">Students</DropdownItem>
                <DropdownItem tag={Link} to="/teams" className="text-light dropdown-item-text-color">Teams</DropdownItem>
                <DropdownItem divider />
                <DropdownItem tag={Link} to="/grade" className="text-light dropdown-item-text-color">Grade</DropdownItem>
              </DropdownMenu>
            </UncontrolledDropdown>
            <NavItem className="mx-2">
              <Link to="/professors" className="text-light nav-link">Professors</Link>
            </NavItem>
          </Nav>
          <UncontrolledDropdown inNavbar className="mr-2">
            <DropdownToggle nav caret className="text-light">Welcome, {authHandler.getUsername()}!</DropdownToggle>
            <DropdownMenu right className="bg-secondary">
              <DropdownItem tag={Link} to={`/user/${authHandler.getUsername()}`} className="text-light dropdown-item-text-color">Profile</DropdownItem>
              <DropdownItem divider />
              <DropdownItem className="text-light dropdown-item-text-color" onClick={logout}>Logout</DropdownItem>
            </DropdownMenu>
          </UncontrolledDropdown>
        </Collapse>)
        : (<Collapse isOpen={!isCollapsed} navbar>
          <Nav navbar className="mr-auto">
            <NavItem className="mx-2">
              <Link to="/sign-up" className="text-light">Sign up</Link>
            </NavItem>
            <NavItem className="mx-2 px-2 border border-white rounded">
              <Link to="/login" className="text-light">Login</Link>
            </NavItem>
          </Nav>
        </Collapse>)}
    </Navbar>
  );
}
