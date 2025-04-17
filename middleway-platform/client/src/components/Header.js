import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Header = () => {
  const navigate = useNavigate();
  const {
    userInfo,
    logout,
    isAdmin,
    isModerator,
  } = useContext(AuthContext);

  const logoutHandler = () => {
    logout();
    navigate('/');
    window.location.reload();
  };

  return (
    <header>
      <Navbar style={{ backgroundColor: '#004D40' }} variant="dark" expand="lg" sticky="top" className="shadow-sm py-3">
        <Container>
          <Navbar.Brand as={Link} to="/" className="fw-bold text-uppercase text-white">MiddleWay</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link as={Link} to="/about" className="text-white">About</Nav.Link>
              <Nav.Link as={Link} to="/contact" className="text-white">Contact</Nav.Link>

              {userInfo ? (
                <>
                  {isAdmin && <Nav.Link as={Link} to="/admin" className="text-white">Admin Panel</Nav.Link>}
                  {isModerator && <Nav.Link as={Link} to="/moderator" className="text-white">Moderator Panel</Nav.Link>}

                  <NavDropdown title={<span className="text-white">{userInfo.name}</span>} id="username" menuVariant="dark">
                    <NavDropdown.Item as={Link} to="/profile">Profile</NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/meetup">New Meetup</NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={logoutHandler} className="text-danger">Logout</NavDropdown.Item>
                  </NavDropdown>
                </>
              ) : (
                <Nav.Link as={Link} to="/login" className="text-white">Sign In</Nav.Link>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;