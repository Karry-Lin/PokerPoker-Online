"use client";
import React, {useState} from 'react';
import {Container, Image, Nav, Navbar, NavDropdown, Spinner} from 'react-bootstrap';
import {useUserStore} from "@/app/stores/userStore.js";

const NavBar = ({ avatar, setAvatar }) => {
  const userStore = useUserStore();
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
                  !avatar ? (
                    <Spinner animation="border" />
                  ) : (
                    <Image src={avatar} roundedCircle width={45} height={45}/>
                  )
                }
                id="user-dropdown"
              >
                <NavDropdown.Item onClick={() => setShowModal(true)}>創建房間</NavDropdown.Item>
                <NavDropdown.Item href="/user">個人檔案</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item onClick={() => userStore.logout()} href="/login">登出</NavDropdown.Item>
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
