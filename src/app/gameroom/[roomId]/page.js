'use client'; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation'; 
import End_Page from './status/end/End_page';
import Playing_page from './status/playing/Playing_page';
import Waiting_Page from './status/waiting/Waiting_page';

const GameRoom = () => {
  const { roomId } = useParams(); // Destructure to get roomId directly from params
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (roomId) {
      console.log(roomId);
      const fetchRoomData = async () => {
        try {
          // Correct the URL by using query parameter correctly
          const response = await fetch(`/api/gameroom?id=${roomId}`); 
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
