"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "./Page.module.css";
import getPoint from "./components/getPoint";

export default function ChineseRummy({ prop }) {
  const { roomRef, roomData, nowCards, players, uid, userplace, turn } = prop;
  const [middleCards, setMiddleCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [playerCardCounts, setPlayerCardCounts] = useState({
    top: 6,
    left: 6,
    right: 6,
  });

  useEffect(() => {
    setMiddleCards(nowCards);
    if (players && players.length === 4) {
      const topPlayer = players[(userplace + 1) % 4];
      const leftPlayer = players[(userplace + 2) % 4];
      const rightPlayer = players[(userplace + 3) % 4];

      setPlayerCardCounts({
        top: topPlayer.handCards.length,
        left: leftPlayer.handCards.length,
        right: rightPlayer.handCards.length,
      });
    }
  }, [nowCards, players, userplace]);

  useEffect(() => {
    if (players && uid) {
      const currentPlayer = players.find((player) => player.id === uid);
      if (currentPlayer) {
        setHandCards(currentPlayer.handCards || []);
      }
    }
  }, [players, uid]);

  const handleCardClick = (card) => {
    const isSelected = selectedCards.includes(card);
    if (isSelected) {
      setSelectedCards(selectedCards.filter((c) => c !== card));
    } else {
      if (selectedCards.length === 0) {
        setSelectedCards([card]);
      } else if (selectedCards.length === 1) {
        const firstSelectedCard = selectedCards[0];
        const isFirstCardFromHand = handCards.includes(firstSelectedCard);
        const isClickedCardFromHand = handCards.includes(card);
        if (
          (isFirstCardFromHand && !isClickedCardFromHand) ||
          (!isFirstCardFromHand && isClickedCardFromHand)
        ) {
          setSelectedCards([...selectedCards, card]);
        }
      }
    }
  };

  const handlePass = async () => {
    await updateDoc(roomRef, {
      turn: (turn % 4) + 1,
    });
  };

  const handleSubmit = async () => {
    if (selectedCards.length === 2) {
      const [card1, card2] = selectedCards;
      console.log(card1, card2);
      const point = getPoint(card1, card2);
      console.log("point:", point);
      if (point !== -1) {
        const updatedHandCards = handCards.filter(
          (card) => !selectedCards.includes(card)
        );
        const currentPlayer = players.find((player) => player.id === uid);
        
        await updateDoc(roomRef, {
          [`players.${uid}.handCards`]: updatedHandCards,
          [`players.${uid}.score`]: currentPlayer.score + point,
          nowCards: nowCards.filter((card) => !selectedCards.includes(card)),
          turn: (turn % 4) + 1,
        });
        setSelectedCards([]);
      }
    }
  };

  const renderOtherPlayerCards = (position, count) => (
    <div className={styles[`${position}Player`]}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`${position}-${index}`} className={styles.otherCard}>
          <img src="/cards/0.jpg" alt="Other Player's Card" />
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Other players' cards */}
      {renderOtherPlayerCards("top", playerCardCounts.top)}
      {renderOtherPlayerCards("left", playerCardCounts.left)}
      {renderOtherPlayerCards("right", playerCardCounts.right)}

      {/* Middle cards */}
      <div className={styles.middleCards}>
        {middleCards?.map((card, index) => (
          <div
            key={`middle-${index}`}
            className={`${styles.card} ${
              selectedCards.includes(card) ? styles.selected : ""
            }`}
            onClick={() => handleCardClick(card)}
          >
            <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
          </div>
        ))}
      </div>

      {/* Player's hand cards */}
      <div className={styles.cardRowWrapper}>
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
        {userplace === turn && (
          <>
            {selectedCards.length === 2 && (
              <button className={styles.submitButton} onClick={handleSubmit}>
                Submit
              </button>
            )}
            <button className={styles.submitButton} onClick={handlePass}>
              Pass
            </button>
          </>
        )}
      </div>
    </div>
  );
}
