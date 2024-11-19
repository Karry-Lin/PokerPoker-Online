"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "./Page.module.css";
import getPoint from "./components/getPoint";

export default function Test({ prop }) {
  console.log(prop)
  const { roomRef, roomData, nowCards, players, uid, userplace, turn, deck } =
    prop;
  const [middleCards, setMiddleCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [selectedHandCard, setSelectedHandCard] = useState(null);
  const [selectedMiddleCard, setSelectedMiddleCard] = useState(null);
  const [flipCard, setFlipCard] = useState(null);

  const [playerCardCounts, setPlayerCardCounts] = useState({
    top: 13,
    left: 13,
    right: 13,
  });

  // Reset selections when turn changes
  useEffect(() => {
    setSelectedHandCard(null);
    setSelectedMiddleCard(null);
    setFlipCard(null);
  }, [turn]);

  useEffect(() => {
    setMiddleCards(nowCards);
    if (players && players.length === 4) {
      const topPlayer = players[(userplace + 1) % 4];
      const leftPlayer = players[(userplace + 2) % 4];
      const rightPlayer = players[(userplace + 3) % 4];

      setPlayerCardCounts({
        top: topPlayer.handCards?.length || 0,
        left: leftPlayer.handCards?.length || 0,
        right: rightPlayer.handCards?.length || 0,
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

  const handleMiddleCardClick = (card) => {
    if (userplace !== turn) return; // Only allow selection on player's turn
    if (flipCard) {
      // When there's a flip card, only allow middle card selection for matching
      setSelectedMiddleCard(card);
    } else if (selectedHandCard) {
      // Only allow middle card selection when a hand card is selected
      setSelectedMiddleCard(card);
    }
  };

  const handleHandCardClick = (card) => {
    if (userplace !== turn || flipCard) return; // Prevent hand card selection when flip card is present
    setSelectedHandCard(card);
  };

  const handleThrowHandCard = async () => {
    try {
      if (userplace !== turn) return;

      const updatedHandCards = handCards.filter((c) => c !== selectedHandCard);
      const updatedMiddleCards = [...middleCards, selectedHandCard];

      await updateDoc(roomRef, {
        nowCards: updatedMiddleCards,
        [`players.${uid}.handCards`]: updatedHandCards,
        deck: deck.slice(1),
      });

      // After throwing a hand card, automatically set the flip card
      setFlipCard(deck[0]);
      setSelectedHandCard(null);
    } catch (error) {
      console.error("Error throwing hand card:", error);
    }
  };

  const handleThrowFlipCard = async () => {
    try {
      if (userplace !== turn || !flipCard) return;

      const updatedMiddleCards = [...middleCards, flipCard];

      await updateDoc(roomRef, {
        nowCards: updatedMiddleCards,
        turn: (turn + 1) % 4,
        deck: deck.slice(1),
      });

      setFlipCard(null);
      setSelectedMiddleCard(null);
    } catch (error) {
      console.error("Error throwing flip card:", error);
    }
  };

  const handleSubmitFlipCard = async () => {
    try {
      if (userplace !== turn || !flipCard || !selectedMiddleCard) return;

      const point = getPoint(flipCard, selectedMiddleCard);
      if (point !== -1) {
        const updatedMiddleCards = middleCards.filter(
          (card) => card !== selectedMiddleCard
        );

        await updateDoc(roomRef, {
          nowCards: updatedMiddleCards,
          turn: (turn + 1) % 4,
          [`players.${uid}.score`]: (roomData.players[uid]?.score || 0) + point,
          deck: deck.slice(1),
        });

        setSelectedMiddleCard(null);
        setFlipCard(null);
      } else {
        alert("Please select valid cards");
        setSelectedMiddleCard(null);
      }
    } catch (error) {
      console.error("Error submitting flip card:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (userplace !== turn || !selectedHandCard || !selectedMiddleCard)
        return;

      const point = getPoint(selectedHandCard, selectedMiddleCard);
      if (point !== -1) {
        const updatedMiddleCards = middleCards.filter(
          (card) => card !== selectedMiddleCard
        );

        const updatedHandCards = handCards.filter(
          (card) => card !== selectedHandCard
        );

        await updateDoc(roomRef, {
          [`players.${uid}.handCards`]: updatedHandCards,
          [`players.${uid}.score`]: (roomData.players[uid]?.score || 0) + point,
          nowCards: updatedMiddleCards,
        });

        setSelectedMiddleCard(null);
        setSelectedHandCard(null);
      } else {
        alert("Please select valid cards");
        setSelectedMiddleCard(null);
        setSelectedHandCard(null);
      }
    } catch (error) {
      console.error("Error updating game state:", error);
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
      {renderOtherPlayerCards("top", playerCardCounts.top)}
      {renderOtherPlayerCards("left", playerCardCounts.left)}
      {renderOtherPlayerCards("right", playerCardCounts.right)}

      <div className={styles.middleCards}>
        {middleCards?.map((card, index) => (
          <div
            key={`middle-${index}`}
            className={`${styles.card} ${
              selectedMiddleCard === card ? styles.selected : ""
            }`}
            onClick={() => handleMiddleCardClick(card)}
          >
            <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
          </div>
        ))}
      </div>

      <div className={styles.cardRowWrapper}>
        {flipCard && (
          <div className={styles.handCards}>
            <div className={styles.card}>
              <img
                src={`/cards/${flipCard}.png`}
                alt={`Flip Card ${flipCard}`}
              />
            </div>
          </div>
        )}

        <div className={styles.handCards}>
          {handCards?.map((card, index) => (
            <div
              key={`hand-${index}`}
              className={`${styles.card} ${
                selectedHandCard === card ? styles.selected : ""
              }`}
              onClick={() => handleHandCardClick(card)}
            >
              <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
            </div>
          ))}
        </div>

        {userplace === turn && (
          <div className={styles.actionButtons}>
            {selectedHandCard && selectedMiddleCard && (
              <button className={styles.submitButton} onClick={handleSubmit}>
                Submit
              </button>
            )}
            {selectedHandCard && !selectedMiddleCard && (
              <button
                className={styles.submitButton}
                onClick={handleThrowHandCard}
              >
                Throw
              </button>
            )}
            {flipCard && selectedMiddleCard && (
              <button
                className={styles.submitButton}
                onClick={handleSubmitFlipCard}
              >
                Submit
              </button>
            )}
            {flipCard && !selectedMiddleCard && (
              <button
                className={styles.submitButton}
                onClick={handleThrowFlipCard}
              >
                Throw
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
