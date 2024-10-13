"use client";
import React from 'react';
import { Navbar, Nav, NavDropdown, Image, Container } from 'react-bootstrap';
import { useState } from 'react';

const NavBar = () => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <Navbar bg="light" expand="lg" fixed="top">
        <Container>
          <Navbar.Brand href="/">PokerPoker</Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="me-auto">
              <Nav.Link href="/lobby">Lobby</Nav.Link>
            </Nav>
            <Nav>
              <NavDropdown
                title={
                  <Image
                    src="/avator_test.jpg"
                    roundedCircle
                    width={40}
                    height={40}
                  />
                }
                id="user-dropdown"
              >
                <NavDropdown.Item onClick={() => setShowModal(true)}>創建房間</NavDropdown.Item>
                <NavDropdown.Item href="/user">個人檔案</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item href="/login">登出</NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {/*<CreateRoomModal show={showModal} handleClose={() => setShowModal(false)} />*/}
    </>
  );
};

export default NavBar;
