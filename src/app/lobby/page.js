'use client';
import { useEffect, useState } from 'react';
import { Form, Card, Col, Button, Modal, Alert } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { HiLockClosed, HiLockOpen } from 'react-icons/hi2';
import NavBar from '../components/navBar';
import styles from './Page.module.css';
import { useUserStore } from '@/app/stores/userStore.js';
import { database } from '@/utils/firebase.js';
import { doc, getDoc, setDoc } from 'firebase/firestore';

export default function GameRoomPage() {
  const router = useRouter();
  const userStore = useUserStore();

  // State management
  const [rooms, setRooms] = useState([]);
  const [gameType, setGameType] = useState('全部');
  const [searchTerm, setSearchTerm] = useState('');
  const [modalState, setModalState] = useState({
    show: false,
    password: '',
    selectedRoom: null,
    error: ''
  });
  const [userData, setUserData] = useState({
    avatar: '',
    uid: ''
  });

  // Fetch rooms data
  useEffect(() => {
    const fetchRooms = async () => {
      const response = await fetch('/api/gameroom');
      const data = await response.json();
      if (response.ok) setRooms(data);
    };
    fetchRooms();
  }, []);

  // Fetch user data
  useEffect(() => {
    if (!userStore.userId) return;

    const fetchUser = async () => {
      const response = await fetch(`/api/user?id=${userStore.userId}`);
      const data = await response.json();
      if (response.ok) {
        setUserData({
          avatar: data.avatar || '',
          uid: userStore.userId
        });
      }
    };
    fetchUser();
  }, [userStore.userId]);

  // Filter rooms based on search and game type
  const filteredRooms = rooms.filter(
    (room) =>
      (gameType === '全部' || room.type === gameType) &&
      room.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const gameTypes = ['全部', ...new Set(rooms.map((room) => room.type))];

  // Room joining logic
  const joinRoom = async (roomId) => {
    const roomRef = doc(database, `room/${roomId}`);
    try {
      const snapshot = await getDoc(roomRef);
      const roomData = snapshot.data();
      const playerCount = roomData?.players
        ? Object.keys(roomData.players).length
        : 0;

      await setDoc(roomRef, {
        ...roomData,
        players: {
          ...roomData.players,
          [userData.uid]: {
            place: playerCount + 1,
            handCards: [],
            score: 0,
            avatar: userData.avatar,
            ready: false
          }
        }
      });
      router.push(`/gameroom/${roomId}`);
    } catch (error) {
      console.error('Error joining room:', error);
      setModalState((prev) => ({ ...prev, error: 'Failed to join room' }));
    }
  };

  const handleRoomEntry = (room) => {
    if (room.password) {
      setModalState({ ...modalState, show: true, selectedRoom: room });
    } else {
      joinRoom(room.id);
    }
  };

  const handlePasswordSubmit = () => {
    const { selectedRoom, password } = modalState;
    if (selectedRoom.password === password) {
      setModalState({
        show: false,
        password: '',
        selectedRoom: null,
        error: ''
      });
      joinRoom(selectedRoom.id);
    } else {
      setModalState((prev) => ({ ...prev, error: 'Incorrect password' }));
    }
  };

  return (
    <div className={styles.page}>
      <NavBar
        avatar={userData.avatar}
        setAvatar={(avatar) => setUserData((prev) => ({ ...prev, avatar }))}
      />

      <div className='d-flex'>
        <Col md={1}></Col>
        {/* Search and Filter Section */}
        <Col md={3} className='p-4'>
          <h2>搜尋房間</h2>
          <input
            type='text'
            className={`form-control ${styles.searchBar}`}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder='請輸入房間名稱'
          />

          <h2 className='mt-4'>選擇遊戲</h2>
          <div className={styles.gameTypeList}>
            {gameTypes.map((type) => (
              <div
                key={type}
                onClick={() => setGameType(type)}
                className={`${styles.item} ${
                  gameType === type ? styles['is-active'] : ''
                } py-2`}
              >
                {type}
              </div>
            ))}
          </div>
        </Col>

        {/* Room List Section */}
        <Col md={8} className='p-4'>
          {filteredRooms.map((room) => (
            <Card key={room.id} className={styles.card}>
              <Card.Header className={styles.roomHeader}>
                <span>{room.name}</span>
                {room.password ? <HiLockClosed /> : <HiLockOpen />}
              </Card.Header>
              <Card.Body>
                <div className={styles.roomText}>
                  <div className='d-flex justify-content-between align-items-center'>
                    <div>
                      <p className='mb-2'>遊戲: {room.type}</p>
                      <p className='mb-0'>
                        人數: {Object.keys(room.players).length}/
                        {room.maxPlayer}
                      </p>
                    </div>
                    <Button
                      variant={
                        Object.keys(room.players).length === room.maxPlayer
                          ? 'secondary'
                          : 'primary'
                      }
                      disabled={
                        Object.keys(room.players).length === room.maxPlayer
                      }
                      onClick={() => handleRoomEntry(room)}
                    >
                      {Object.keys(room.players).length === room.maxPlayer
                        ? '已滿'
                        : '進入'}
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          ))}
        </Col>
      </div>

      {/* Password Modal */}
      <Modal
        show={modalState.show}
        onHide={() => setModalState((prev) => ({ ...prev, show: false }))}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Room Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type='password'
            value={modalState.password}
            onChange={(e) =>
              setModalState((prev) => ({ ...prev, password: e.target.value }))
            }
          />
          {modalState.error && (
            <Alert variant='danger' className='mt-3'>
              {modalState.error}
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant='secondary'
            onClick={() => setModalState((prev) => ({ ...prev, show: false }))}
          >
            Cancel
          </Button>
          <Button variant='primary' onClick={handlePasswordSubmit}>
            Enter Room
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
