'use client';
import { Card, ListGroup, Button, ToggleButton } from 'react-bootstrap';
import styles from './Page.module.css';
import { useRouter } from 'next/navigation';

function End_Page({roomId}) {
  const router = useRouter();
  const sequence = ['1st', '2nd', '3rd', '4th'];
  const players = [
    { name: 'p1', money: 30, place: 1 },
    { name: 'p2', money: 20, place: 2 },
    { name: 'p3', money: 15, place: 3 },
    { name: 'p4', money: 12, place: 4 }
  ];

  function submit_Again() {
    router.push('/gameroom');
  }
  function submit_Lobby() {
    router.push('/lobby');
  }

  return (
    <div className={styles.body}>
      {players.map((player, index) => (
        <Card key={index} className={styles.card}>
          <Card.Img
            variant='top'
            src='avator_test.jpg'
            className={styles.avator}
          />
          <Card.Body className={styles.card_body}>
            <Card.Title className={styles.card_title}>
              {sequence[index]} Place
            </Card.Title>
          </Card.Body>
          <ListGroup>
            <ListGroup.Item>Name: {player.name}</ListGroup.Item>
            <ListGroup.Item>Money: ${player.money}</ListGroup.Item>
          </ListGroup>
        </Card>
      ))}

      <ToggleButton onClick={()=>submit_Again()} className={styles.button}>
        Play Again
      </ToggleButton>
      <ToggleButton onClick={()=>submit_Lobby()} className={styles.button}>
        Back To Lobby
      </ToggleButton>
    </div>
  );
}

export default End_Page;
