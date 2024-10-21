'use client';
import React, { useState } from 'react';
import {
  Container,
  Image,
  Nav,
  Navbar,
  NavDropdown,
  Spinner,
  Modal,
  Button,
  Form
} from 'react-bootstrap';
import { useUserStore } from '@/app/stores/userStore.js';

const CreateRoomModal = ({ show, handleClose, createRoom }) => {
  const [roomName, setRoomName] = useState('');
  const [password, setPassword] = useState('');
  const [roomType, setRoomType] = useState('Chinese Poker');

  const handleSubmit = () => {
    const currentTime = new Date().toLocaleString();
    createRoom(roomName, password, roomType, currentTime);
    handleClose();
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>創建房間</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="roomName">
            <Form.Label>房間名稱</Form.Label>
            <Form.Control
              type="text"
              placeholder="輸入房間名稱"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="password" className="mt-3">
            <Form.Label>密碼</Form.Label>
            <Form.Control
              type="text"
              placeholder="設定密碼（選填）"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="roomType" className="mt-3">
            <Form.Label>房間類型</Form.Label>
            <Form.Control
              as="select"
              value={roomType}
              onChange={(e) => setRoomType(e.target.value)}
            >
              <option value="Chinese Poker">十三支</option>
              <option value="Chinese Rummy">撿紅點</option>
              <option value="Big two">大老二</option>
            </Form.Control>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          取消
        </Button>
        <Button variant="primary" onClick={handleSubmit}>
          創建
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

const NavBar = ({ avatar, setAvatar }) => {
  const userStore = useUserStore();
  const [showModal, setShowModal] = useState(false);

  const createRoom = async (name, password, type, time) => {
    try {
      if (!userStore.user || !userStore.user.id) {
        throw new Error('User data is missing. Please log in.');
      }
      const userId = userStore.user.id;
  
      const response = await fetch('/api/gameroom', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          name,
          password,
          type,
        }),
      });
  
      const result = await response.json();
  
      if (response.status === 201) {
        console.log('Room Created Successfully:', result);
      } else {
        console.error('Error creating room:', result.error);
        alert(result.error);
      }
    } catch (error) {
      console.error('Request failed:', error.message);
      alert(error.message); // Inform the user about the missing data
    }
  };
  
  

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
                    <Image src={avatar} roundedCircle width={45} height={45} />
                  )
                }
                id="user-dropdown"
              >
                <NavDropdown.Item onClick={() => setShowModal(true)}>
                  創建房間
                </NavDropdown.Item>
                <NavDropdown.Item href="/user">個人檔案</NavDropdown.Item>
                <NavDropdown.Divider />
                <NavDropdown.Item
                  onClick={() => userStore.logout()}
                  href="/login"
                >
                  登出
                </NavDropdown.Item>
              </NavDropdown>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      <CreateRoomModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        createRoom={createRoom}
      />
    </>
  );
};

export default NavBar;
