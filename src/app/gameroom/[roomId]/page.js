'use client'; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useUserStore } from '@/app/stores/userStore.js';

import End_Page from './end/End_page';
import Playing_page from './playing/Playing_page';
import Waiting_Page from './waiting/Waiting_page';

const GameRoom = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);
  const [prop, setProp] = useState(null);
  const userStore = useUserStore();

  useEffect(() => {
    if (roomId) {
      const fetchRoomData = async () => {
        try {
          const response = await fetch(`/api/gameroom?id=${roomId}`);
          if (!response.ok) throw new Error('Failed to load room data');
          const data = await response.json();
          setRoomData(data);
          console.log('Room Data:', data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchRoomData();
    }
  }, [roomId]);

  useEffect(() => {
    if (roomData && userStore.userId) {
      // Convert players object to an array of player data 
      const playersArray = roomData.players
        ? Object.keys(roomData.players).map((key) => ({
        id: key,
        ...roomData.players[key],
        score: 0
      })):[];
      const updatedProp = {
        uid: userStore.userId,
        roomId: roomData.id,
        nowCards: [],
        players: playersArray,
        type: roomData.type
      };

      setProp(updatedProp);
      console.log('Prop:', updatedProp);
    }
  }, [roomData, userStore.userId]);

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
