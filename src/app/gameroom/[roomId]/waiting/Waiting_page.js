"use client";
import { Card, ListGroup, ToggleButton } from "react-bootstrap";
import styles from "./Page.module.css";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import shuffleCards from "../playing/BigTwo/conponents/shuffleCards";

export default function Waiting_Page({ prop }) {
  const router = useRouter();
  const [deck, setDeck] = useState([]);
  const [players, setPlayers] = useState([]);
  
  // Shuffle the deck on component load
  useEffect(() => {
    const shuffledDeck = shuffleCards();
    setDeck(shuffledDeck);
  }, []);

  useEffect(() => {
    const defaultPlayers = [
      { id: "default1", name: "Waiting...", ready: false, place: 1, score: 0, handCards: [] },
      { id: "default2", name: "Waiting...", ready: false, place: 2, score: 0, handCards: [] },
      { id: "default3", name: "Waiting...", ready: false, place: 3, score: 0, handCards: [] },
      { id: "default4", name: "Waiting...", ready: false, place: 4, score: 0, handCards: [] },
    ];
    
    // Merge prop players with default players
    const mergedPlayers = [...prop.players, ...defaultPlayers].slice(0, 4);
    setPlayers(mergedPlayers);
    console.log(prop)
  }, [prop.players]);

  // Check if all four players are ready
  const areAllPlayersReady = players.every(player => player.ready === true);

  // Submit functions for handling button clicks
  function submit_Ready() {
    console.log("Ready button clicked");
    // Implement your ready-up logic here
  }

  function submit_Lobby() {
    const leaveRoom = async (roomId, userId) => {
      const roomRef = doc(database, `room/${roomId}`);
      try {
        const roomSnapshot = await getDoc(roomRef);
        const roomData = roomSnapshot.data();
  
        if (roomData?.players && roomData.players[userId]) {
          const updatedPlayers = { ...roomData.players };
          delete updatedPlayers[userId];
          await setDoc(roomRef, { ...roomData, players: updatedPlayers });
        }
      } catch (error) {
        console.error("Error leaving room:", error);
        setErrorMessage("Could not leave the room. Please try again.");
      }
    };
    router.push("/lobby");
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
              <ListGroup.Item>State: {player.ready?"ready":"unready"}</ListGroup.Item>
            </ListGroup>
          </Card>
        ))}
      </div>

      <div className={styles.button_container}>
        <ToggleButton onClick={() => submit_Ready()} className={styles.button}>
          Ready
        </ToggleButton>
        <ToggleButton onClick={() => submit_Lobby()} className={styles.button}>
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
