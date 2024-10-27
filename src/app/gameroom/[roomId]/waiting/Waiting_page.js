"use client";
import { Card, ListGroup, ToggleButton } from "react-bootstrap";
import styles from "./Page.module.css";
import { useRouter } from "next/navigation";
import { useState,useEffect } from "react";
import shuffleCards from "../playing/BigTwo/conponents/shuffleCards";

export default function Waiting_Page({ prop }) {
  const router = useRouter();
  const [deck, setDeck] = useState([]);
  useEffect(() => {
    const shuffledDeck = shuffleCards();
    setDeck(shuffledDeck);
  }, []);
  const sequence = ["1st", "2nd", "3rd", "4th"];
  const players = [
    { name: "p1", state: "Ready", place: 1 },
    { name: "p2", state: "unReady", place: 2 },
    { name: "p3", state: "Ready", place: 3 },
    { name: "p4", state: "unReady", place: 4 },
  ];

  function submit_Ready() {}
  function submit_Lobby() {
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
                {sequence[index]} Place
              </Card.Title>
            </Card.Body>
            <ListGroup>
              <ListGroup.Item>Name: {player.name}</ListGroup.Item>
              <ListGroup.Item>state: {player.state}</ListGroup.Item>
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
    </div>
  );
}