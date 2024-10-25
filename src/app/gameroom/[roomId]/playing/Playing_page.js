"use client"; // Mark this component as a Client Component

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { useUserStore } from '@/app/stores/userStore.js';

const GameRoom = () => {
  const { roomId } = useParams();
  const [roomData, setRoomData] = useState(null);
  const [error, setError] = useState(null);
  const [currentUser, setCurrentUser] = useState();
  const [prop, setProp] = useState([]);
  const userStore = useUserStore();

  useEffect(() => {
    if (roomId) {
      const fetchRoomData = async () => {
        try {
          const response = await fetch(`/api/gameroom?id=${roomId}`);
          if (!response.ok) throw new Error("Failed to load room data");
          const data = await response.json();
          setRoomData(data);
        } catch (err) {
          setError(err.message);
        }
      };
      fetchRoomData();
    }
  }, [roomId]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetch(`/api/user?id=${userStore.userId}`, {
        method: "GET",
      });
      const data = await response.json();
      if (response.ok) {
        setCurrentUser(data || "");
      } else {
        console.log(data.error);
      }
    };
    if (userStore.userId) {
      fetchUserData();
    }
  }, [userStore.userId]);

  useEffect(() => {
    if (roomData && currentUser) {
      setProp({ roomData, currentUser });
      console.log(prop);
    }
  }, [roomData, currentUser]);

  if (error) return <div>Error: {error}</div>;
  if (!roomData) return <p>Loading...</p>;

  return (
    <div>
      {roomData.state === "waiting" ? (
        <Waiting_Page prop={prop} />
      ) : roomData.state === "playing" ? (
        <Playing_page prop={prop} />
      ) : roomData.state === "end" ? (
        <End_Page prop={prop} />
      ) : (
        <div>Unknown state</div>
      )}
    </div>
  );
};

export default GameRoom;
