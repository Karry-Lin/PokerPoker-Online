'use client'; // Mark this component as a Client Component

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Use next/navigation for app directory
import { useParams } from 'next/navigation'; // Use useParams for dynamic route parameters

const GameRoom = () => {
  const router = useRouter();
  const { roomId } = useParams(); // Get roomId from the dynamic route
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (roomId) {
      console.log(roomId)
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

  return (
    <div>
      {roomData ? (
        <div>
          <h1>Room: {roomData.name}</h1>
          <p>Type: {roomData.type}</p>
          <p>Created At: {roomData.time}</p>
          {/* Render other room details */}
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default GameRoom;
