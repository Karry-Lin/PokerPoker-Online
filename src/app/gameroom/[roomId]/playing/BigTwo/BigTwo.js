'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './Page.module.css';
import { database } from '@/utils/firebase.js';
import compare from './components/compare';

export default function BigTwo({ prop }) {
  console.log(prop);
  const { roomRef, roomData, nowCards, players, uid, userplace, turn } = prop;
  const [middleCards, setMiddleCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [playerCardCounts, setPlayerCardCounts] = useState({
    top: 13,
    left: 13,
    right: 13
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
        right: rightPlayer.handCards.length
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
    setSelectedCards((prevSelected) =>
      prevSelected.includes(card)
        ? prevSelected.filter((c) => c !== card)
        : [...prevSelected, card]
    );
  };

  const handlePass = async () => {
    await updateDoc(roomRef, {
      turn: (turn % 4) + 1
    });
  };
  const handleSubmit = async () => {
    if (prop.startTurn != userplace) {
      if (!compare(selectedCards, middleCards)) {
        console.log('Invalid card combination');
        return;
      }
    }

    try {
      if (!roomData.players || roomData.players.uid === -1) {
        throw new Error('Invalid player data');
      }

      const updatedHandCards = handCards.filter(
        (card) => !selectedCards.includes(card)
      );

      await updateDoc(roomRef, {
        [`players.${uid}.handCards`]: updatedHandCards,
        nowCards: selectedCards,
        startTurn:userplace,
        turn: (turn % 4) + 1
      });

      setHandCards(updatedHandCards);
      setSelectedCards([]);
      if (updatedHandCards.length === 0) {
        console.log(`Player ${uid} has won the game!`);
        // Additional logic for handling the win, e.g., ending the game or showing a message
        await updateDoc(roomRef, {
          state: 'end'
          // winner: uid
        });
      }
    } catch (error) {
      console.error('Error updating game state:', error);
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
      {renderOtherPlayerCards('top', playerCardCounts.top)}
      {renderOtherPlayerCards('left', playerCardCounts.left)}
      {renderOtherPlayerCards('right', playerCardCounts.right)}

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
          className={`${styles.submitButton} ${
            userplace !== turn ? styles.disabledButton : ''
          }`}
          onClick={userplace === turn ? handleSubmit : undefined}
          disabled={userplace !== turn || selectedCards.length === 0}
        >
          Submit
        </button>
        <button
          className={`${styles.submitButton} ${
            userplace !== turn ? styles.disabledButton : ''
          }`}
          onClick={userplace === turn ? handlePass : undefined}
          disabled={userplace !== turn}
        >
          Pass
        </button>
      </div>
    </div>
  );
}
