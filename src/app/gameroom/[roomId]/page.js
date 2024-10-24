'use client'; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation'; // Use this to get route params
import End_Page from './end/End_page';
import Playing_page from './playing/Playing_page';
import Waiting_Page from './waiting/Waiting_page';

const GameRoom = () => {
  const { id: roomId } = useParams(); // Destructure to get roomId directly from params
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (roomId) {
      const fetchRoomData = async () => {
        try {
          const response = await fetch(`/api/gameroom/${roomId}`); // Use a more standard route format
          if (!response.ok) throw new Error('Failed to load room data');

          const data = await response.json();
          setRoomData(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchRoomData();
    }
  }, [roomId]);

  if (error) return <div>Error: {error}</div>;
  if (!roomData) return <p>Loading...</p>;

  return (
    <div>
      {roomData.state === 'waiting' ? (
        <Waiting_Page id={roomData.id} />
      ) : roomData.state === 'playing' ? (
        <Playing_page />
      ) : roomData.state === 'end' ? (
        <End_Page />
      ) : (
        <div>Unknown state</div>
      )}
    </div>
  );
};

export default GameRoom;
