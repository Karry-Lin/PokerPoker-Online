"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "./Page.module.css";
import getPoint from "./components/getPoint";

export default function ChineseRummy({ roomRef, roomData, nowCards, players, uid, userplace, turn }) {
  // State management
  const [middleCards, setMiddleCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [selectedHandCard, setSelectedHandCard] = useState(null);
  const [selectedMiddleCard, setSelectedMiddleCard] = useState(null);
  const [playerCardCounts, setPlayerCardCounts] = useState({
    top: 6,
    left: 6,
    right: 6,
  });

  // Update middle cards and player card counts when data changes
  useEffect(() => {
    if (!nowCards) return;
    
    setMiddleCards(nowCards);
    
    if (players?.length === 4) {
      const playerPositions = {
        top: (userplace + 1) % 4,
        left: (userplace + 2) % 4,
        right: (userplace + 3) % 4,
      };

      const newCardCounts = Object.entries(playerPositions).reduce((acc, [position, playerIndex]) => {
        const player = players[playerIndex];
        acc[position] = player?.handCards?.length || 6;
        return acc;
      }, {});

      setPlayerCardCounts(newCardCounts);
    }
  }, [nowCards, players, userplace]);

  // Update hand cards when player data changes
  useEffect(() => {
    if (!players || !uid) return;
    
    const currentPlayer = players.find(player => player.id === uid);
    setHandCards(currentPlayer?.handCards || []);
  }, [players, uid]);

  // Card selection handlers
  const handleHandCardClick = (card) => {
    setSelectedHandCard(selectedHandCard === card ? null : card);
  };

  const handleMiddleCardClick = (card) => {
    setSelectedMiddleCard(selectedMiddleCard === card ? null : card);
  };

  // Game action handlers
  const handlePass = async () => {
    if (!roomRef) return;
    
    try {
      await updateDoc(roomRef, {
        turn: (turn % 4) + 1,
      });
    } catch (error) {
      console.error("Error passing turn:", error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedMiddleCard || !selectedHandCard || !roomRef) return;
    
    try {
      const point = getPoint(selectedMiddleCard, selectedHandCard);
      
      if (point === -1) {
        console.log("Invalid card combination");
        return;
      }

      const currentPlayer = players.find(player => player.id === uid);
      if (!currentPlayer) return;

      const updatedHandCards = handCards.filter(card => card !== selectedHandCard);
      const updatedMiddleCards = middleCards.filter(card => card !== selectedMiddleCard);

      await updateDoc(roomRef, {
        [`players.${uid}.handCards`]: updatedHandCards,
        [`players.${uid}.score`]: (currentPlayer.score || 0) + point,
        nowCards: updatedMiddleCards,
        turn: (turn % 4) + 1,
      });

      // Reset selections after successful submission
      setSelectedHandCard(null);
      setSelectedMiddleCard(null);
    } catch (error) {
      console.error("Error submitting move:", error);
    }
  };

  // Render helper functions
  const renderOtherPlayerCards = (position, count) => (
    <div className={styles[`${position}Player`]}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`${position}-${index}`} className={styles.otherCard}>
          <img src="/cards/0.jpg" alt="Card back" className={styles.cardImage} />
        </div>
      ))}
    </div>
  );

  const renderPlayerCard = (card, index, isHandCard) => (
    <div
      key={`${isHandCard ? 'hand' : 'middle'}-${index}`}
      className={`${styles.card} ${
        (isHandCard ? selectedHandCard : selectedMiddleCard) === card ? styles.selected : ''
      }`}
      onClick={() => isHandCard ? handleHandCardClick(card) : handleMiddleCardClick(card)}
    >
      <img 
        src={`/cards/${card}.png`} 
        alt={`Card ${card}`}
        className={styles.cardImage}
      />
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Other players' cards */}
      {Object.entries(playerCardCounts).map(([position, count]) => 
        renderOtherPlayerCards(position, count)
      )}

      {/* Middle cards */}
      <div className={styles.middleCards}>
        {middleCards?.map((card, index) => renderPlayerCard(card, index, false))}
      </div>

      {/* Player's hand cards */}
      <div className={styles.cardRowWrapper}>
        <div className={styles.handCards}>
          {handCards.map((card, index) => renderPlayerCard(card, index, true))}
        </div>
        
        {userplace === turn && (
          <div className={styles.actionButtons}>
            {selectedHandCard && selectedMiddleCard && (
              <button 
                className={styles.submitButton} 
                onClick={handleSubmit}
              >
                Submit
              </button>
            )}
            <button 
              className={styles.submitButton} 
              onClick={handlePass}
            >
              Pass
            </button>
          </div>
        )}
      </div>
    </div>
  );
}