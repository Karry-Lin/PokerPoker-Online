'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, ListGroup, ToggleButton } from 'react-bootstrap';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { database } from '@/utils/firebase.js';
import shuffleCards from '../playing/BigTwo/conponents/shuffleCards';
import styles from './Page.module.css';

// Default player template
const DEFAULT_PLAYER = {
  avatar: '/avator_test.jpg',
  username: 'Waiting...',
  ready: false,
  score: 0,
  handCards: []
};

// Create array of 4 default players
const DEFAULT_PLAYERS = Array.from({ length: 4 }, (_, index) => ({
  ...DEFAULT_PLAYER,
  id: `default${index + 1}`,
  place: index + 1
}));

export default function WaitingPage({ prop }) {
  const router = useRouter();
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);

  // Initialize deck and players
  useEffect(() => {

    if (prop?.players) {
      const mergedPlayers = [...prop.players, ...DEFAULT_PLAYERS].slice(0, 4);
      setPlayers(mergedPlayers);
    }
  }, [prop?.players]);

  // Check if all players are ready and update room state
  useEffect(() => {
    const checkAndUpdateGameState = async () => {
      const areAllPlayersReady = players.every((player) => player.ready);

      if (areAllPlayersReady && prop?.roomId) {
        try {
          const roomRef = doc(database, `room/${prop.roomId}`);
          const roomSnapshot = await getDoc(roomRef);
          const roomData = roomSnapshot.data();
          await setDoc(roomRef, { ...roomData, state: 'playing' });
        } catch (error) {
          console.error('Error updating game state:', error);
        }
      }
    };

    checkAndUpdateGameState();
  }, [players, prop?.roomId]);

  // Handle ready status toggle
  const handleReadyToggle = async () => {
    if (!prop?.roomId || !prop?.uid) return;

    try {
      const roomRef = doc(database, `room/${prop.roomId}`);
      const roomSnapshot = await getDoc(roomRef);
      const roomData = roomSnapshot.data();

      if (roomData?.players?.[prop.uid]) {
        const isReady = !roomData.players[prop.uid].ready;
        const updatedPlayers = {
          ...roomData.players,
          [prop.uid]: {
            ...roomData.players[prop.uid],
            ready: isReady
          }
        };

        await setDoc(roomRef, { ...roomData, players: updatedPlayers });

        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.id === prop.uid ? { ...player, ready: isReady } : player
          )
        );

        // Update button style
        const readyButton = document.querySelector(`.${styles.button}`);
        if (readyButton) {
          readyButton.classList.toggle(styles.ready, isReady);
        }
      }
    } catch (error) {
      console.error('Error updating ready status:', error);
    }
  };

  // Handle returning to lobby
  const handleReturnToLobby = async () => {
    if (!prop?.roomId || !prop?.uid) return;

    try {
      const roomRef = doc(database, `room/${prop.roomId}`);
      const roomSnapshot = await getDoc(roomRef);
      const roomData = roomSnapshot.data();

      if (roomData?.players?.[prop.uid]) {
        const updatedPlayers = { ...roomData.players };
        delete updatedPlayers[prop.uid];
        await setDoc(roomRef, { ...roomData, players: updatedPlayers });
      }

      router.push('/lobby');
    } catch (error) {
      console.error('Error leaving room:', error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.card_container}>
        {players.map((player, index) => (
          <Card key={player.id} className={styles.card}>
            <Card.Img
              variant='top'
              src={player.avatar}
              className={styles.avator}
            />
            <Card.Body className={styles.card_body}>
              <Card.Title className={styles.card_title}>
                {index + 1} Place
              </Card.Title>
            </Card.Body>
            <ListGroup>
              <ListGroup.Item>Name: {player.username}</ListGroup.Item>
              <ListGroup.Item>
                State: {player.ready ? 'ready' : 'unready'}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        ))}
      </div>

      <div className={styles.button_container}>
        <ToggleButton onClick={handleReadyToggle} className={styles.button}>
          Ready
        </ToggleButton>
        <ToggleButton onClick={handleReturnToLobby} className={styles.button}>
          Back To Lobby
        </ToggleButton>
      </div>
    </div>
  );
}
