import React, { useState, useEffect } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import styles from './Page.module.css';

export default function PlaceHandCards({ prop }) {
  const { roomRef, players, uid } = prop;

  const [handCards, setHandCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [rows, setRows] = useState({
    top: [],
    middle: [],
    bottom: []
  });

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

  return (
    <div className={styles.container}>
      {/* Display rows */}
      {renderCardRow('top')}
      {renderCardRow('middle')}
      {renderCardRow('bottom')}

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

      {/* Submit button */}
    </div>
  );
}
