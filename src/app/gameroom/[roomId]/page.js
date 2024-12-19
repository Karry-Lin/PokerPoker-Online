'use client';
import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUserStore } from '@/app/stores/userStore.js';
import { doc, onSnapshot } from 'firebase/firestore';
import End_Page from './end/End_page';
import Playing_page from './playing/Playing_page';
import Waiting_Page from './waiting/Waiting_page';
import { getDatabase } from '@/utils/firebase.js';

const GameRoom = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);
  const [prop, setProp] = useState({});
  const userStore = useUserStore();

  useEffect(() => {
    if (!roomId) return;

    getDatabase().then((database) => {
      // Set up real-time listener
      const roomRef = doc(database, 'room', roomId);
      // const userRef = doc(database, 'user', userStore.userId);
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
          if (
            !(
              userStore.userId &&
              data.players &&
              data.players[userStore.userId]
            )
          )
            return <p>Loading...</p>;
          // Update prop if userStore.userId is available
          if (
            userStore.userId &&
            data.players &&
            data.players[userStore.userId]
          ) {
            const playersArray = Object.keys(data.players).map((key) => ({
              id: key,
              ...data.players[key],
            }));

            setProp({
              uid: userStore.userId,
              roomId: data.id,
              isShuffled: data.isShuffled,
              nowCards: data.nowCards || [],
              players: playersArray,
              type: data.type || '',
              userplace: data.players[userStore.userId]?.place || null,
              turn: data.turn,
              roomRef,
              database,
              roomData: data,
              isPassed: data.players[userStore.userId]?.isPassed || false,
              startTurn: data.startTurn,
              deck:data.deck||null,
              showResult:data.players[userStore.userId]?.showResult,
              startTime:data.startTime||null,
              areAllPlayersEnd:data.areAllPlayersEnd||0,
              calculated:data.calculated||null
            });
          } else if (!userStore.userId) {
            setError('User not logged in');
          }
        },
        (err) => {
          console.error('Error getting room updates:', err);
          setError(err.message);
        }
      );

      return () => {
        unsubscribe();
      };
    });
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
