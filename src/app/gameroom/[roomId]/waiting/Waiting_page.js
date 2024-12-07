"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, ListGroup, Modal ,Button } from "react-bootstrap";
import { doc, getDoc, setDoc,updateDoc } from "firebase/firestore";
import styles from "./Page.module.css";

const DEFAULT_PLAYER = {
  avatar: "/avatar_test.jpg",
  username: "Waiting...",
  ready: false,
  score: 0,
  handCards: [],
  money: 0,
  place: 999, // High default place for sorting
};

// Create array of 4 default players
const DEFAULT_PLAYERS = Array.from({ length: 4 }, (_, index) => ({
  ...DEFAULT_PLAYER,
  id: `default${index + 1}`,
  place: index + 1,
}));

export default function WaitingPage({ prop }) {
  const router = useRouter();
  const [players, setPlayers] = useState(DEFAULT_PLAYERS);
  const { roomData, roomRef, showResult } = prop;

  // ShowResultModal Component
  const ShowResultModal = ({ show, handleClose }) => {
    console.log('players',players)
    const sortedPlayers = [...players].sort((a, b) => b.score - a.score);
    return (
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Game Results</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {sortedPlayers.map((player) => (
            <div key={player.id} className={styles.playerBlock}>
              <img
                src={player.avatar}
                alt={`${player.username}'s avatar`}
                className={styles.playerAvatar}
              />
              <div className={styles.playerInfo}>
                <div className={styles.playerName}>{player.username}</div>
                <div className={styles.playerScore}>Score: {player.score}</div>
              </div>
            </div>
          ))}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    );
  };
  const CloseModal = async () => {
    try {
      await updateDoc(roomRef, {
        [`players.${prop?.uid}.showResult`]: false,
      });
    } catch (error) {}
  };

  useEffect(() => {
    if (prop?.players) {
      const firebasePlayers = Object.entries(prop.players).map(
        ([id, playerData]) => ({
          ...playerData,
          id,
        })
      );

      const mergedPlayers = [...firebasePlayers, ...DEFAULT_PLAYERS]
        .slice(0, 4)
        .sort((a, b) => {
          if (a.place && b.place) {
            return a.place - b.place;
          }
          if (!a.place) return 1;
          if (!b.place) return -1;
          return 0;
        });

      setPlayers(mergedPlayers);
      console.log(mergedPlayers);
    }
  }, [prop?.players]);

  useEffect(() => {
    const checkAndUpdateGameState = async () => {
      const areAllPlayersReady = players.every((player) => player.ready);
      if (areAllPlayersReady && prop?.roomId) {
        try {
          await setDoc(roomRef, { ...roomData, state: "playing" });
        } catch (error) {
          console.error("Error updating game state:", error);
        }
      }
    };

    checkAndUpdateGameState();
  }, [players, prop?.roomId]);

  // Handle ready status toggle
  const handleReadyToggle = async () => {
    try {
      if (roomData?.players?.[prop.uid]) {
        const isReady = !roomData.players[prop.uid].ready;
        const updatedPlayers = {
          ...roomData.players,
          [prop.uid]: {
            ...roomData.players[prop.uid],
            ready: isReady,
          },
        };
        await setDoc(roomRef, { ...roomData, players: updatedPlayers });
        setPlayers((prevPlayers) =>
          prevPlayers.map((player) =>
            player.id === prop.uid ? { ...player, ready: isReady } : player
          )
        );
        // Update button style
        const readyButton = document.querySelector(`.${styles.button}`);
        if (readyButton) {
          readyButton.classList.toggle(styles.ready, isReady);
        }
      }
    } catch (error) {
      console.error("Error updating ready status:", error);
    }
  };

  // Handle returning to lobby
  const handleReturnToLobby = async () => {
    if (!prop?.roomId || !prop?.uid) return;
    try {
      if (roomData?.players?.[prop.uid]) {
        const updatedPlayers = { ...roomData.players };
        delete updatedPlayers[prop.uid];
        await setDoc(roomRef, { ...roomData, players: updatedPlayers });
      }
      router.push("/lobby");
    } catch (error) {
      console.error("Error leaving room:", error);
    }
  };

  return (
    <div className={styles.body}>
      <div className={styles.card_container}>
        {players.map((player) => (
          <Card key={player.id} className={styles.card}>
            <Card.Img
              variant="top"
              src={player.avatar}
              className={styles.avator}
            />
            <Card.Body className={styles.card_body}>
              <Card.Title className={styles.card_title}>
                {player.username}
              </Card.Title>
            </Card.Body>
            <ListGroup>
              <ListGroup.Item>Money: {player.money}</ListGroup.Item>
              <ListGroup.Item>
                State: {player.ready ? "ready" : "unready"}
              </ListGroup.Item>
            </ListGroup>
          </Card>
        ))}
      </div>

      <div className={styles.button_container}>
        <button onClick={handleReadyToggle} className={styles.button}>
          {roomData?.players[prop.uid].ready ? "UnReady" : "Ready"}
        </button>
        <button onClick={handleReturnToLobby} className={styles.button}>
          Back To Lobby
        </button>
      </div>
      <ShowResultModal show={showResult} handleClose={CloseModal} />
    </div>
  );
}
