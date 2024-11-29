import React, { useState, useEffect } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import styles from './Page.module.css';

export default function PlaceHandCards({ prop }) {
  const { roomRef, players, uid, userplace } = prop;

  const [handCards, setHandCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [rows, setRows] = useState({
    top: [],
    middle: [],
    bottom: []
  });
  const [playerCardCounts, setPlayerCardCounts] = useState({
    top: 13,
    left: 13,
    right: 13
  });
  const [timer, setTimer] = useState(60);

  // Function to randomize card placement
  const randomizeCardPlacement = () => {
    const allCards = [
      ...handCards,
      ...rows.top,
      ...rows.middle,
      ...rows.bottom
    ];
    const shuffled = allCards.sort(() => Math.random() - 0.5);

    setRows({
      top: shuffled.slice(0, 3),
      middle: shuffled.slice(3, 8),
      bottom: shuffled.slice(8, 13)
    });
    setHandCards([]); // Clear hand cards after placing them
  };
  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(countdown); // Clear interval on component unmount
    } else {
      // Time's up! Randomize card placement
      randomizeCardPlacement();
    }
  }, [timer]);

  useEffect(() => {
    if (players && players.length === 4) {
      const topPlayer = players[(userplace + 1) % 4];
      const leftPlayer = players[(userplace + 2) % 4];
      const rightPlayer = players[(userplace + 3) % 4];

      setPlayerCardCounts({
        top: topPlayer.handCards.length,
        left: leftPlayer.handCards.length,
        right: rightPlayer.handCards.length
      });
    }
  }, [prop]);

  useEffect(() => {
    if (players && uid) {
      const currentPlayer = players.find((player) => player.id === uid);
      if (currentPlayer) {
        setHandCards(currentPlayer.handCards || []);
      }
    }
  }, [players, uid]);

  const handleCardClick = (card) => {
    setSelectedCards((prev) =>
      prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card]
    );
  };

  const handleMoveToRow = (row) => {
    const maxCards = row === 'top' ? 3 : 5;
    if (rows[row].length + selectedCards.length > maxCards) {
      alert(`The ${row} row is full.`);
      return;
    }
    setRows((prev) => ({
      ...prev,
      [row]: [...prev[row], ...selectedCards]
    }));
    setHandCards((prev) =>
      prev.filter((card) => !selectedCards.includes(card))
    );
    setSelectedCards([]);
  };

  const handleReturnToHand = (row) => {
    setHandCards((prev) => [...prev, ...rows[row]]);
    setRows((prev) => ({
      ...prev,
      [row]: []
    }));
  };

  const isRowFull = (row) => {
    const maxCards = row === 'top' ? 3 : 5;
    return rows[row].length >= maxCards;
  };

  const isAllRowsFull = () =>
    rows.top.length === 3 &&
    rows.middle.length === 5 &&
    rows.bottom.length === 5;
  const handleSubmit = async () => {
    const updatedHandCards = [];
    // updatedHandCards = {rows.top+middle+bottom}

    await updateDoc(roomRef, {
      [`players.${uid}.showCards`]: updatedHandCards,
    });
    alert('commit sucessful');
  };

  const renderCardRow = (row) => (
    <div className={`${styles.cardRow} ${styles[row]}`}>
      {rows[row].map((card, index) => (
        <div
          key={`${row}-${index}`}
          className={styles.card}
          onClick={() => handleReturnToHand(row)}
        >
          <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
        </div>
      ))}
    </div>
  );
  const renderOtherPlayerCards = (position, count) => (
    <div className={styles[`${position}Player`]}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`${position}-${index}`} className={styles.otherCard}>
          <img src='/cards/0.jpg' alt="Other Player's Card" />
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      {renderOtherPlayerCards('top', playerCardCounts.top)}
      {renderOtherPlayerCards('left', playerCardCounts.left)}
      {renderOtherPlayerCards('right', playerCardCounts.right)}
      {/* Display rows */}
      {renderCardRow('top')}
      {renderCardRow('middle')}
      {renderCardRow('bottom')}
      <div className={styles.timer}>Time left: {timer}s</div>

      {/* Hand cards */}
      <div className={styles.handCardsWrapper}>
        <div className={styles.handCards}>
          {handCards.map((card, index) => (
            <div
              key={`hand-${index}`}
              className={`${styles.card} ${
                selectedCards.includes(card) ? styles.selected : ''
              }`}
              onClick={() => handleCardClick(card)}
            >
              <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
            </div>
          ))}
        </div>
        {!isAllRowsFull() && (
          <div className={styles.buttons}>
            <button
              className={styles.button}
              onClick={() => handleMoveToRow('top')}
              disabled={isRowFull('top')}
            >
              Move to Top Row
            </button>
            <button
              className={styles.button}
              onClick={() => handleMoveToRow('middle')}
              disabled={isRowFull('middle')}
            >
              Move to Middle Row
            </button>
            <button
              className={styles.button}
              onClick={() => handleMoveToRow('bottom')}
              disabled={isRowFull('bottom')}
            >
              Move to Bottom Row
            </button>
          </div>
        )}
        {isAllRowsFull() && (
          <button className={styles.submitbutton} onClick={handleSubmit}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
