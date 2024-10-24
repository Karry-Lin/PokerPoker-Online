'use client';
import { Card, ListGroup, ToggleButton } from 'react-bootstrap';
import styles from './Page.module.css';
import { useRouter } from 'next/navigation';

function Waiting_Page({roomId}) {
  const router = useRouter();
  const sequence = ['1st', '2nd', '3rd', '4th'];
  const players = [
    { name: 'p1', state: 'Ready', place: 1 },
    { name: 'p2', state: 'unReady', place: 2 },
    { name: 'p3', state: 'Ready', place: 3 },
    { name: 'p4', state: 'unReady', place: 4 }
  ];

  function submit_Ready() {}
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
            <ListGroup.Item>state: {player.state}</ListGroup.Item>
          </ListGroup>
        </Card>
      ))}
      <br/>
      <ToggleButton onClick={() => submit_Ready()} className={styles.button}>
        Ready
      </ToggleButton>
      <ToggleButton onClick={() => submit_Lobby()} className={styles.button}>
        Back To Lobby
      </ToggleButton>
    </div>
  );
}

export default Waiting_Page;
