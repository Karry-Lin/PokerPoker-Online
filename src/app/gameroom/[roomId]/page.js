'use client'; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for app directory
import { useParams } from 'next/navigation'; // Use useParams for dynamic route parameters
import End_Page from './status/end/End_page';
import Playing_page from './status/playing/Playing_page';
import Waiting_Page from './status/waiting/Waiting_page';

const GameRoom = () => {
  const router = useRouter();
  const { roomId } = useParams(); // Get roomId from the dynamic route
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (roomId) {
      console.log(roomId);
      // Fetch room data when roomId is available
      const fetchRoomData = async () => {
        try {
          const response = await fetch(`/api/gameroom/?id=${roomId}`);
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

  // Conditional rendering based on room state
  return (
    <div>
      {roomData.state === 'waiting' ? (
        <Waiting_Page />
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
