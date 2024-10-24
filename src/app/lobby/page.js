'use client';
import { Search, List } from 'semantic-ui-react'; 
import 'semantic-ui-css/semantic.min.css';

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
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useParams } from 'next/navigation';
import { HiLockClosed, HiLockOpen } from 'react-icons/hi2';
import NavBar from '../components/navBar';
import styles from './Page.module.css';
import { useUserStore } from '@/app/stores/userStore.js';

export default function Page() {
  const router= useRouter()
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    const getRooms = async () => {
      const response = await fetch(`/api/gameroom`, {
        method: 'GET'
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error);
      }
      setRooms(data);
    };
    getRooms();
  }, []);

  const [selectedGameType, setSelectedGameType] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [avatar, setAvatar] = useState('');
  const userStore = useUserStore();

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`/api/user?id=${userStore.userId}`, {
        method: 'GET'
      });
      const data = await response.json();
      if (response.ok) {
        setAvatar(data.avatar || '');
      } else {
        console.log(data.error);
      }
    };
    if (userStore.userId) {
      fetchUserData();
    }
  }, [userStore.userId]);

  const filteredRooms = rooms
    .filter(
      (room) => selectedGameType === 'all' || room.type === selectedGameType
    )
    .filter((room) =>
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const gameTypes = ['all', ...new Set(rooms.map((room) => room.type))];

  const handleEnterRoom = (room) => {
    if (room.password) {
      setSelectedRoom(room);
      setShowModal(true);
    } else {
      alert("go")
      router.push(`/gameroom/${room.id}`);
    }
  };

  const handlePasswordSubmit = () => {
    if (selectedRoom.password === passwordInput) {
      router.push(`/gameroom/${selectedRoom.id}`);
      setShowModal(false);
      setPasswordInput('');
      setErrorMessage('');
    } else {
      setErrorMessage('Incorrect password. Please try again.');
    }
  };

  return (
    <>
      <NavBar avatar={avatar} setAvatar={setAvatar} />
      <Container fluid className={styles.page}>
        <Row>
          <Col xs={12} md={1}></Col>
          <Col xs={12} md={3} className='p-4'>
            <span style={{ fontSize: '35px' }}>搜尋房間</span>
            <Search
              input={{
                icon: 'search',
                iconPosition: 'left',
                style: { width: '350px', height: '60px', padding: '8px' }
              }}
              value={searchTerm}
              onSearchChange={(_, { value }) => setSearchTerm(value)}
              showNoResults={false}
              placeholder='請輸入房間名稱'
            />
            <br />
            <Form.Group>
              <Form.Label>
                <span style={{ fontSize: '35px' }}>選擇遊戲</span>
              </Form.Label>
              <List animated selection>
                {gameTypes.map((type, index) => (
                  <List.Item
                    style={{ width: '350px', height: '40px', fontSize: '20px' }}
                    key={index}
                    onClick={() => setSelectedGameType(type)}
                    active={selectedGameType === type}
                  >
                    {type}
                  </List.Item>
                ))}
              </List>
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
                  <Card.Text as='div' className={styles.room_text}>
                    <div style={{ margin: '1px' }}>
                      <span style={{ fontSize: '25px' }}>Game : </span>
                      <span style={{ fontSize: '20px' }}>{room.type}</span>
                    </div>
                    <br />
                    <div style={{ margin: '1px' }}>
                      <span style={{ fontSize: '25px' }}>Players : </span>
                      <span style={{ fontSize: '20px' }}>
                        {Object.keys(room.players).length}/{room.maxPlayer}
                      </span>
                    </div>

                    <Button
                      style={{ float: 'right' }}
                      variant={
                        Object.keys(room.players).length === room.maxPlayer
                          ? 'secondary'
                          : 'primary'
                      }
                      disabled={
                        Object.keys(room.players).length === room.maxPlayer
                      }
                      onClick={() => handleEnterRoom(room)}
                    >
                      Enter
                    </Button>
                  </Card.Text>
                </Card.Body>
              </Card>
            ))}
          </Col>
        </Row>

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
