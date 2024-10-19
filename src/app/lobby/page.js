'use client';
import { useState } from 'react';
import { Form, Card, Container, Row, Col, Button, Modal, Alert } from 'react-bootstrap';
import { FaLock } from 'react-icons/fa'; // Import lock icon from react-icons
import styles from './Page.module.css'; // Custom CSS for background image

export default function Page() {
  const rooms = [
    {
      name: 'room1',
      state: 'Ready',
      id: 1,
      gametype: '13poker',
      current_player: 3,
      max_player: 4,
      password: null
    },
    {
      name: 'room2',
      state: 'unReady',
      id: 2,
      gametype: 'big2',
      current_player: 4,
      max_player: 4,
      password: '123456'
    },
    {
      name: 'room3',
      state: 'Ready',
      id: 3,
      gametype: 'pickred',
      current_player: 2,
      max_player: 4,
      password: '122333'
    },
    {
      name: 'room4',
      state: 'unReady',
      id: 4,
      gametype: '13poker',
      current_player: 3,
      max_player: 4,
      password: null
    },
    {
      name: 'room5',
      state: 'unReady',
      id: 5,
      gametype: '13poker',
      current_player: 1,
      max_player: 4,
      password: null
    },
    {
      name: 'room6',
      state: 'unReady',
      id: 6,
      gametype: '13poker',
      current_player: 1,
      max_player: 4,
      password: null
    },
    {
      name: 'room7',
      state: 'unReady',
      id: 7,
      gametype: '13poker',
      current_player: 2,
      max_player: 4,
      password: null
    },
    
  ];

  const [selectedGameType, setSelectedGameType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  // Filter rooms based on selected game type and search term
  const filteredRooms = rooms
    .filter(
      (room) => selectedGameType === 'all' || room.gametype === selectedGameType
    )
    .filter((room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  // Extract unique game types for the select options
  const gameTypes = ['all', ...new Set(rooms.map((room) => room.gametype))];

  // Handle search input
  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle room entry
  const handleEnterRoom = (room) => {
    if (room.password) {
      setSelectedRoom(room);
      setShowModal(true); // Show password modal if the room has a password
    } else {
      alert(`Entering ${room.name}`);
    }
  };

  // Handle password validation
  const handlePasswordSubmit = () => {
    if (selectedRoom.password === passwordInput) {
      alert(`Successfully entered ${selectedRoom.name}`);
      setShowModal(false);
      setPasswordInput('');
      setErrorMessage('');
    } else {
      setErrorMessage('Incorrect password. Please try again.');
    }
  };

  return (
    <Container fluid className={styles.page}>
      <Row>
        <Col xs={12} md={3} className='p-4'>
          <Form.Group>
            <Form.Label>Select Game Type</Form.Label>
            <Form.Control
              as='select'
              value={selectedGameType}
              onChange={(e) => setSelectedGameType(e.target.value)}
              className='mb-3'
            >
              {gameTypes.map((type) => (
                <option key={type} value={type}>
                  {type === 'all' ? 'Select All' : type}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          {/* Search bar to filter rooms */}
          <Form.Control
            type='text'
            placeholder='Search room...'
            value={searchTerm}
            onChange={handleSearch}
            className='mb-3'
          />
        </Col>

        <Col xs={12} md={7} className='p-4'>
          {filteredRooms.map((room) => (
            <Card key={room.id} className='mb-4'>
              <Card.Body>
                <Card.Text>
                  {room.name}
                  {room.password && (
                    <FaLock
                      className='ml-2'
                      style={{ cursor: 'pointer' }}
                      title="Password protected" // Show lock icon if room is password protected
                    />
                  )}
                  <br />
                  <strong>Game Type:</strong> {room.gametype}
                  <br />
                  <strong>Current Players:</strong> {room.current_player}/
                  {room.max_player}
                  <br />
                  <strong>Status:</strong> {room.state}
                  <br />
                </Card.Text>
                <Button
                  variant={
                    room.current_player === room.max_player
                      ? 'secondary'
                      : 'primary'
                  }
                  disabled={room.current_player === room.max_player}
                  onClick={() => handleEnterRoom(room)}
                >
                  {room.current_player === room.max_player
                    ? 'Room Full'
                    : 'Enter'}
                </Button>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </Row>

      {/* Password modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Enter Room Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
            />
          </Form.Group>
          {errorMessage && <Alert variant="danger" className="mt-3">{errorMessage}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePasswordSubmit}>
            Enter Room
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}
