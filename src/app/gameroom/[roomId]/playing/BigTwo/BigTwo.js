'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './Page.module.css';
import { database } from '@/utils/firebase.js';
import compare from './components/compare';

const PLAYER_CARD_COUNTS = {
  top: 8,
  left: 10,
  right: 13
};

export default function BigTwo({ prop }) {
  const { roomId, nowCards, players, uid } = prop;
  const [middleCards, setMiddleCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);

  // Update middle cards when props change
  useEffect(() => {
    if (nowCards) {
      setMiddleCards(nowCards);
    }
  }, [nowCards]);

  // Update hand cards when player data changes
  useEffect(() => {
    if (players && uid) {
      const currentPlayer = players.find((player) => player.id === uid);
      if (currentPlayer) {
        setHandCards(currentPlayer.handCards || []);
      }
    }
  }, [players, uid]);

  const handleCardClick = (card) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(card)
        ? prevSelected.filter((c) => c !== card)
        : [...prevSelected, card]
    );
  };

  const handleSubmit = async () => {
    if (!compare(selectedCards, middleCards)) {
      console.log('Invalid card combination');
      return;
    }
    try {
      const roomRef = doc(database, `room/${roomId}`);
      const roomSnapshot = await getDoc(roomRef);

      const roomData = roomSnapshot.data();

      if (!roomData.players || roomData.players.uid === -1) {
        throw new Error('Invalid player data');
      }

      const updatedHandCards = handCards.filter(
        (card) => !selectedCards.includes(card)
      );

      await updateDoc(roomRef, {
        [`players.${uid}.handCards`]: updatedHandCards,
        nowCards: selectedCards
      });

      setHandCards(updatedHandCards);
      setSelectedCards([]);
    } catch (error) {
      console.error('Error updating game state:', error);
      // TODO: Add user feedback for errors
    }
  };

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
      {/* Other players' cards */}
      {renderOtherPlayerCards('top', PLAYER_CARD_COUNTS.top)}
      {renderOtherPlayerCards('left', PLAYER_CARD_COUNTS.left)}
      {renderOtherPlayerCards('right', PLAYER_CARD_COUNTS.right)}

      {/* Middle cards */}
      <div className={styles.middleCards}>
        {middleCards?.map((card, index) => (
          <div key={`middle-${index}`} className={styles.middleCard}>
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
                selectedCards.includes(card) ? styles.selected : ''
              }`}
              onClick={() => handleCardClick(card)}
            >
              <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
            </div>
          ))}
        </div>
        <button
          className={styles.submitButton}
          onClick={handleSubmit}
          disabled={selectedCards.length === 0}
        >
          Submit
        </button>
      </div>
    </div>
  );
}
