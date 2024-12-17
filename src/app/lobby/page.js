'use client';
import { useEffect, useState } from 'react';
import { Alert, Button, Card, Col, Form, Modal } from 'react-bootstrap';
import { useRouter } from 'next/navigation';
import { HiLockClosed, HiLockOpen } from 'react-icons/hi2';
import NavBar from '../components/navBar';
import styles from './Page.module.css';
import { useUserStore } from '@/app/stores/userStore.js';
import { getDatabase } from '@/utils/firebase.js';
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
    uid: '',
    username: '',
    money:null,
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
          uid: userStore.userId,
          username: data.username,
          money:data.money
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
    const roomRef = doc(await getDatabase(), `room/${roomId}`);
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
            ready: false,
            username: userData.username,
            money:userData.money,
            showResult:false
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

  const [userRank, setUserRank] = useState([]);
  const getRank = async () => {
      const response = await fetch(`/api/rank`, {method: 'GET'});
      const rank = await response.json();
      return rank.map((user, index) => ({
        rank: index + 1,
        ...user,
      }));
  }
  const formatRank = (rank) => {
    if (rank === 1) return "1st";
    if (rank === 2) return "2nd";
    if (rank === 3) return "3rd";
    return `${rank}th`;
  };
  useEffect(() => {
    const fetchRank = async () => {
      const rank = await getRank();
      setUserRank(rank);
    };
    fetchRank().then();
  }, []);
  return (
    <div className={styles.page}>
      <NavBar
        avatar={userData.avatar}
        setAvatar={(avatar) => setUserData((prev) => ({ ...prev, avatar }))}
      />
      <div className='d-flex'>
        <Col style={{ maxWidth: "100px" }} className='p-4'></Col>
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
        <Col md={4} className='p-4'>
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
        <Col style={{ maxWidth: "500px" }} className="p-4">
          <h2
            className="text-center mb-4 fw-bold"
            style={{ fontSize: "2.5rem", textShadow: "2px 2px 4px rgba(0, 0, 0, 0.3)", marginTop: "26px" }}
          >
            排行榜
          </h2>

          <div className="d-flex flex-column gap-3">
            {userRank?.map((user) => (
              <div
                key={user.rank}
                className="d-flex align-items-center p-3 rounded shadow-sm border"
                style={{
                  backgroundColor: "#fff",
                  border: "2px solid #ddd",
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
                  marginBottom: "1rem",
                }}
              >
                {/* 名次 */}
                <span
                  className="fw-bold text-center"
                  style={{
                    fontSize: "2rem",
                    minWidth: "50px",
                    color: "#333",
                    marginRight: "15px",
                    marginLeft: "68px",
                  }}
                >
          {formatRank(user.rank)}
        </span>

                {/* 頭像 */}
                <img
                  src={user.avatar}
                  alt={user.username}
                  className="rounded-circle me-3"
                  style={{ width: "70px", height: "70px", objectFit: "cover" }}
                />

                {/* 使用者資訊 */}
                <div className="flex-grow-1">
                  <h5 className="mb-1 fw-bold" style={{ fontSize: "1.5rem" }}>
                    {user.username}
                  </h5>
                  <p className="mb-0 text-secondary" style={{ fontSize: "1.2rem" }}>
                    💰 {user.money.toLocaleString()} 金幣
                  </p>
                </div>
              </div>
            ))}
          </div>
        </Col>

      </div>

      {/* Password Modal */}
      <Modal
        show={modalState.show}
      >
        <Modal.Header closeButton>
          <Modal.Title>Enter Room Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Control
            type='password'
            value={modalState.password}
            onChange={(e) =>
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
