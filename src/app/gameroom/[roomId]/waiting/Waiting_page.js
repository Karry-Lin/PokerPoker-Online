"use client";
import { Card, ListGroup, ToggleButton } from "react-bootstrap";
import styles from "./Page.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import shuffleCards from "../playing/BigTwo/conponents/shuffleCards";
import { database } from '@/utils/firebase.js';
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where
} from 'firebase/firestore';

export default function Waiting_Page({ prop }) {
  const router = useRouter();
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  
  // Default players array
  const defaultPlayers = [
    { id: "default1", name: "Waiting...", ready: false, place: 1, score: 0, handCards: [] },
    { id: "default2", name: "Waiting...", ready: false, place: 2, score: 0, handCards: [] },
    { id: "default3", name: "Waiting...", ready: false, place: 3, score: 0, handCards: [] },
    { id: "default4", name: "Waiting...", ready: false, place: 4, score: 0, handCards: [] },
  ];

  useEffect(() => {
    const shuffledDeck = shuffleCards();
    setDeck(shuffledDeck);
  }, []);

  useEffect(() => {
    // Only proceed if prop exists and has a players array
    if (prop && Array.isArray(prop.players)) {
      // Merge prop players with default players
      const mergedPlayers = [...prop.players, ...defaultPlayers].slice(0, 4);
      setPlayers(mergedPlayers);
      console.log('Updated players:', mergedPlayers);
    } else {
      // If no prop players, use default players
      setPlayers(defaultPlayers);
      console.log('Using default players');
    }
  }, [prop?.players]); // Only depend on prop.players, with optional chaining

  // Check if all four players are ready
  const areAllPlayersReady = players.every(player => player.ready === true);

  function submit_Ready() {
    console.log("Ready button clicked");
    // Implement your ready-up logic here
  }

  async function submit_Lobby() {
    try {
      if (prop?.roomId && prop?.uid) {
        const roomRef = doc(database, `room/${prop.roomId}`);
        const roomSnapshot = await getDoc(roomRef);
        const roomData = roomSnapshot.data();

        if (roomData?.players && roomData.players[prop.uid]) {
          const updatedPlayers = { ...roomData.players };
          delete updatedPlayers[prop.uid];
          await setDoc(roomRef, { ...roomData, players: updatedPlayers });
        }
      }
      router.push("/lobby");
    } catch (error) {
      console.error("Error leaving room:", error);
      // Handle error appropriately
    }
  }

  return (
    <div className={styles.body}>
      <div className={styles.card_container}>
        {players.map((player, index) => (
          <Card key={index} className={styles.card}>
            <Card.Img
              variant="top"
              src="avator_test.jpg"
              className={styles.avator}
            />
            <Card.Body className={styles.card_body}>
              <Card.Title className={styles.card_title}>
                {index + 1} Place
              </Card.Title>
            </Card.Body>
            <ListGroup>
              <ListGroup.Item>Name: {player.name}</ListGroup.Item>
              <ListGroup.Item>State: {player.ready ? "ready" : "unready"}</ListGroup.Item>
            </ListGroup>
          </Card>
        ))}
      </div>

      <div className={styles.button_container}>
        <ToggleButton onClick={submit_Ready} className={styles.button}>
          Ready
        </ToggleButton>
        <ToggleButton onClick={submit_Lobby} className={styles.button}>
          Back To Lobby
        </ToggleButton>
      </div>

      {areAllPlayersReady && (
        <div className={styles.ready_message}>
          All players are ready! Starting the game...
        </div>
      )}
    </div>
  );
}