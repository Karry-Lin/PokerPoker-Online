'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUserStore } from '@/app/stores/userStore.js';
import { doc, onSnapshot } from 'firebase/firestore';
import { database } from '@/utils/firebase.js';
import End_Page from './end/End_page';
import Playing_page from './playing/Playing_page';
import Waiting_Page from './waiting/Waiting_page';

const GameRoom = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);
  const [prop, setProp] = useState({
    uid: '',
    roomId: '',
    nowCards: [],
    players: [],
    type: ''
  });
  const userStore = useUserStore();

  useEffect(() => {
    if (!roomId) return;

    // Set up real-time listener
    const roomRef = doc(database, 'room', roomId);
    const unsubscribe = onSnapshot(
      roomRef,
      (snapshot) => {
        if (!snapshot.exists()) {
          setError('Room not found');
          return;
        }

        const data = {
          id: snapshot.id,
          ...snapshot.data()
        };
        setRoomData(data);
        console.log('Room Data:', data);

        // Update prop if userStore.userId is available
        if (userStore.userId) {
          const playersArray = data.players
            ? Object.keys(data.players).map((key) => ({
                id: key,
                ...data.players[key],
                score: 0
              }))
            : [];

          setProp({
            uid: userStore.userId,
            roomId: data.id,
            isShuffled: data.isShuffled,
            nowCards: data.nowCards || [],
            players: playersArray,
            type: data.type || ''
          });
        }
      },
      (err) => {
        console.error('Error getting room updates:', err);
        setError(err.message);
      }
    );

    // Cleanup subscription on unmount
    return () => {
      unsubscribe();
    };
  }, [roomId, userStore.userId]); // Include userStore.userId in dependencies

  if (error) return <div>Error: {error}</div>;
  if (!roomData) return <p>Loading...</p>;

  return (
    <div>
      {roomData.state === 'waiting' ? (
        <Waiting_Page prop={prop} />
      ) : roomData.state === 'playing' ? (
        <Playing_page prop={prop} />
      ) : roomData.state === 'end' ? (
        <End_Page prop={prop} />
      ) : (
        <div>Unknown state</div>
      )}
    </div>
  );
};

export default GameRoom;
