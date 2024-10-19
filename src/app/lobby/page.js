'use client';
import { useEffect, useState } from 'react';
import {
  Form,
  Card,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Alert
} from 'react-bootstrap';
import { HiLockClosed, HiLockOpen } from 'react-icons/hi2';
import NavBar from '../components/navBar';
import styles from './Page.module.css';
import { useUserStore } from '@/app/stores/userStore.js';

export default function Page() {
  const rooms = [
    {
      name: '叫我大帥哥',
      state: 'Ready',
      id: 1,
      gametype: '13poker',
      current_player: 3,
      max_player: 4,
      password: null
    },
    {
      name: '小明生日房',
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
  const [avatar, setAvatar] = useState('');

  const userStore = useUserStore(); // Moved here to be accessible

  // Fetch user data when component mounts
  useEffect(() => {
    fetchUserData();
  }, [userStore.userId]); // Dependency array ensures it runs only when userId changes

  const fetchUserData = async () => {
    if (userStore.userId) {
      const response = await fetch(`/api/user?id=${userStore.userId}`, {
        method: 'GET'
      });
      const data = await response.json();
      if (!response.ok) {
        console.log(data.error);
      } else {
        setAvatar(data.avatar || '');
      }
    }
  };

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
    <>
      <NavBar avatar={avatar} setAvatar={setAvatar}></NavBar>
      <Container fluid className={styles.page}>
        <Row>
          <Col xs={12} md={1}></Col>
          <Col xs={12} md={3} className='p-4'>
            {/* Search bar to filter rooms */}
            <Form.Control
              type='text'
              placeholder='輸入房間名稱'
              value={searchTerm}
              onChange={handleSearch}
              className='mb-3'
            />
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
          </Col>

          <Col xs={12} md={5} className='p-4'>
            {filteredRooms.map((room) => (
              <Card key={room.id} className={styles.card}>
                <Card.Header
                  className={`${styles.room_header} d-flex justify-content-between align-items-center`}
                >
                  <span>{room.name}</span>
                  {room.password ? (
                    <HiLockClosed title='Password protected' />
                  ) : (
                    <HiLockOpen title='No password' />
                  )}
                </Card.Header>
                <Card.Body>
                  <Card.Text>
                    <p className={styles.room_text}>
                      Game : {room.gametype}
                      <br />
                      Players : 
                      {room.current_player}/{room.max_player}
                      <Button
                        style={{ float: 'right' }}
                        variant={
                          room.current_player === room.max_player
                            ? 'secondary'
                            : 'primary'
                        }
                        disabled={room.current_player === room.max_player}
                        onClick={() => handleEnterRoom(room)}
                      >
                        Enter
                      </Button>
                    </p>
                  </Card.Text>
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
                type='password'
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
              />
            </Form.Group>
            {errorMessage && (
              <Alert variant='danger' className='mt-3'>
                {errorMessage}
              </Alert>
            )}
          </Modal.Body>
          <Modal.Footer>
            <Button variant='secondary' onClick={() => setShowModal(false)}>
              Cancel
            </Button>
            <Button variant='primary' onClick={handlePasswordSubmit}>
              Enter Room
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>
    </>
  );
}
