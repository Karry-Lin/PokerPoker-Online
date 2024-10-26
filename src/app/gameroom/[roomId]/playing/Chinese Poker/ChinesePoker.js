'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Ensure you import useParams
import styles from './Page.module.css';
import { database } from '@/utils/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function ChinesePoker() {
  const [roomData, setRoomData] = useState(null);
  const [loading, setLoading] = useState(true);
  const { roomId } = useParams();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const roomCollection = collection(database, 'room');
        const roomSnapshot = await getDocs(roomCollection);
        // Filter room data by roomId
        const room = roomSnapshot.docs
          .map(doc => ({ id: doc.id, ...doc.data() })) // Convert each document to an object
          .find(room => room.id === roomId); // Find the room with the matching roomId

        setRoomData(room);
      } catch (error) {
        console.error('Error fetching room data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [roomId]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>Chinese Poker Room Details</h1>
      {roomData ? (
        <div className={styles.roomDetails}>
          <h2>{roomData.name}</h2>
          <p>{roomData.description}</p>
        </div>
      ) : (
        <p>No room found with the provided ID.</p>
      )}
    </div>
  );
}
