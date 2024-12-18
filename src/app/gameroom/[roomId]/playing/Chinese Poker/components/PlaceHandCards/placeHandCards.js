import React, { useState, useEffect } from "react";
import { updateDoc } from "firebase/firestore";
import styles from "./Page.module.css";
import getCardTypeScore from "../getCardType";

export default function PlaceHandCards({ prop }) {
  const { roomRef, players, uid, userplace, startTime } = prop;

  const [handCards, setHandCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [rows, setRows] = useState({
    top: [],
    middle: [],
    bottom: [],
  });
  // const [timer, setTimer] = useState(() => {
  //   if (startTime?.seconds) {
  //     const now = new Date().getTime() / 1000;
  //     const elapsedTime = Math.floor(now - startTime.seconds);
  //     return Math.max(0, 120 - elapsedTime);
  //   }
  //   return 120; 
  // });

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setTimer((prev) => Math.max(0, prev - 1));
  //   }, 1000);
  //   return () => clearInterval(interval);
  // }, []);

  useEffect(() => {
    if (players && uid) {
      const currentPlayer = players.find((player) => player.id === uid);
      if (currentPlayer) {
        setHandCards(currentPlayer.handCards || []);
        // If we also stored rows before, load them:
        if (currentPlayer.rows) {
          setRows(currentPlayer.rows);
        }
      }
    }
  }, [players, uid]);

  const handleCardClick = (card) => {
    setSelectedCards((prev) =>
      prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card]
    );
  };

  const handleMoveToRow = async (row) => {
    const maxCards = row === "top" ? 3 : 5;
    if (rows[row].length + selectedCards.length > maxCards) {
      alert(`The ${row} row is full.`);
      return;
    }

    const newRows = {
      ...rows,
      [row]: [...rows[row], ...selectedCards],
    };

    const newHand = handCards.filter((card) => !selectedCards.includes(card));
    setRows(newRows);
    setHandCards(newHand);
    setSelectedCards([]);

    // Update Firestore after moving cards
    await updateDoc(roomRef, {
      [`players.${uid}.rows`]: newRows,
      [`players.${uid}.handCards`]: newHand,
    });
  };

  const handleReturnToHand = async (row) => {
    const returnedCards = rows[row];
    const newHand = [...handCards, ...returnedCards];
    const newRows = {
      ...rows,
      [row]: [],
    };

    setRows(newRows);
    setHandCards(newHand);

    // Update Firestore after returning cards
    await updateDoc(roomRef, {
      [`players.${uid}.rows`]: newRows,
      [`players.${uid}.handCards`]: newHand,
    });
  };

  const isRowFull = (row) => {
    const maxCards = row === "top" ? 3 : 5;
    return rows[row].length >= maxCards;
  };

  const isAllRowsFull = () =>
    rows.top.length === 3 && rows.middle.length === 5 && rows.bottom.length === 5;

  // const fillRowsToFull = (currentRows, currentHand) => {
  //   const updatedRows = { ...currentRows };
  //   let updatedHand = [...currentHand];

  //   const fillRow = (rowName, max) => {
  //     const diff = max - updatedRows[rowName].length;
  //     if (diff > 0) {
  //       const cardsToMove = updatedHand.splice(0, diff);
  //       updatedRows[rowName] = [...updatedRows[rowName], ...cardsToMove];
  //     }
  //   };

  //   fillRow("top", 3);
  //   fillRow("middle", 5);
  //   fillRow("bottom", 5);

  //   return { updatedRows, updatedHand };
  // };

  const compareScores = (a, b) => {
    for (let i = 0; i < Math.max(a.length, b.length); i++) {
      const aVal = a[i] !== undefined ? a[i] : 0;
      const bVal = b[i] !== undefined ? b[i] : 0;
      if (aVal !== bVal) {
        return aVal < bVal ? -1 : 1;
      }
    }
    return 0;
  };

  const handleSubmit = async (rowsToSubmit = rows) => {
    const topScore = getCardTypeScore(rowsToSubmit.top);
    const middleScore = getCardTypeScore(rowsToSubmit.middle);
    const bottomScore = getCardTypeScore(rowsToSubmit.bottom);

    // Check order
    if (compareScores(topScore, middleScore) >= 0) {
      alert("Top row must be weaker than the middle row.");
      return;
    }
    if (compareScores(middleScore, bottomScore) >= 0) {
      alert("Middle row must be weaker than the bottom row.");
      return;
    }

    // Update Firestore on final submit
    await updateDoc(roomRef, {
      [`players.${uid}.showCards`]: rowsToSubmit,
      [`players.${uid}.isPassed`]: true,
    });

    alert("Commit successful");
  };

  // useEffect(() => {
  //   if (timer === 0) {
  //     if (!isAllRowsFull()) {
  //       const { updatedRows, updatedHand } = fillRowsToFull(rows, handCards);
  //       // Submit with fully filled rows
  //       handleSubmit(updatedRows);
  //       setRows(updatedRows);
  //       setHandCards(updatedHand);
  //     } else {
  //       handleSubmit(rows);
  //     }
  //   }
  // }, [timer]);

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
      {renderCardRow("top")}
      {renderCardRow("middle")}
      {renderCardRow("bottom")}

      {/* <div className={styles.timer}>Time left: {timer}s</div> */}

      <div className={styles.handCardsWrapper}>
        <div className={styles.handCards}>
          {handCards.map((card, index) => (
            <div
              key={`hand-${index}`}
              className={`${styles.card} ${
                selectedCards.includes(card) ? styles.selected : ""
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
              onClick={() => handleMoveToRow("top")}
              disabled={isRowFull("top")}
            >
              Move to Top Row
            </button>
            <button
              className={styles.button}
              onClick={() => handleMoveToRow("middle")}
              disabled={isRowFull("middle")}
            >
              Move to Middle Row
            </button>
            <button
              className={styles.button}
              onClick={() => handleMoveToRow("bottom")}
              disabled={isRowFull("bottom")}
            >
              Move to Bottom Row
            </button>
          </div>
        )}
        {isAllRowsFull() && (
          <button className={styles.submitbutton} onClick={() => handleSubmit()}>
            Submit
          </button>
        )}
      </div>
    </div>
  );
}
