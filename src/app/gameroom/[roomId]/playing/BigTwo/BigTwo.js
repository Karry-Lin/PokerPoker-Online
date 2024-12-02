'use client';

import { useEffect, useState } from 'react';
import { updateDoc } from 'firebase/firestore';
import styles from './Page.module.css';
import { database } from '@/utils/firebase.js';
import compare from './components/compare';
import count_point from './components/count_point';

export default function BigTwo({ prop }) {
  const {
    roomRef,
    roomData,
    nowCards,
    players,
    uid,
    userplace,
    turn,
    isPassed
  } = prop;

  // State hooks
  const [middleCards, setMiddleCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [playerCardCounts, setPlayerCardCounts] = useState({
    top: 13,
    left: 13,
    right: 13
  });

  // Update middle cards and player card counts
  useEffect(() => {
    setMiddleCards(nowCards);
    if (players && players.length === 4) {
      const getPlayerByRelativePlace = (offset) =>
        players.find(
          (player) => player.place === ((userplace + offset) % 4) + 1
        );

      const topPlayer = getPlayerByRelativePlace(2);
      const leftPlayer = getPlayerByRelativePlace(1);
      const rightPlayer = getPlayerByRelativePlace(3);

      setPlayerCardCounts({
        top: topPlayer?.handCards.length ?? 13,
        left: leftPlayer?.handCards.length ?? 13,
        right: rightPlayer?.handCards.length ?? 13
      });
    }
  }, [nowCards, players, userplace]);

  // Update hand cards for current player
  useEffect(() => {
    if (players && uid) {
      const currentPlayer = players.find((player) => player.id === uid);
      setHandCards(currentPlayer?.handCards || []);
    }
  }, [players, uid]);

  // Handle turn and pass logic
  useEffect(() => {
    const resetIsPassed = async () => {
      
      const playerIds = Object.keys(players);
        const updatedPlayers = {};
        playerIds.forEach((playerId) => {
          updatedPlayers[playerId] = {
            ...players[playerId],
            isPassed: false
          };
        });

      await updateDoc(roomRef, {
        ...roomData,
        players: updatedPlayers,
        nowCards: []
      });
    };

    const pass = async () => {
      await updateDoc(roomRef, {
        turn: (turn % 4) + 1
      });
    };

    if (isPassed) {
      pass();
      return;
    }

    if (prop.startTurn === turn) {
      resetIsPassed();
    }
  }, [turn, isPassed, prop.startTurn, players, roomRef, roomData]);

  // Card selection handler
  const handleCardClick = (card) => {
    setSelectedCards((prev) =>
      prev.includes(card) ? prev.filter((c) => c !== card) : [...prev, card]
    );
  };

  // Pass turn handler
  const handlePass = async () => {
    await updateDoc(roomRef, {
      turn: (turn % 4) + 1,
      [`players.${uid}.isPassed`]: true
    });
  };

  // Submit cards handler
  const handleSubmit = async () => {
    if (!compare(selectedCards, middleCards)) {
      console.log('Invalid card combination');
      return;
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
        startTurn: userplace,
        turn: (turn % 4) + 1
      });

      setHandCards(updatedHandCards);
      setSelectedCards([]);

      if (updatedHandCards.length === 0) {
        const playerIds = Object.keys(players);
        const updatedPlayers = {};
        playerIds.forEach((playerId) => {
          updatedPlayers[playerId] = {
            ...players[playerId],
            score: count_point(players[playerId].handCards)
          };
        });
        await updateDoc(roomRef, {
          players: updatedPlayers,
          state: 'end'
        });
      }
    } catch (error) {
      console.error('Error updating game state:', error);
    }
  };

  // Render other players' card backs
  const renderOtherPlayerCards = (position, count) => (
    <div className={styles[`${position}Player`]}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`${position}-${index}`} className={styles.otherCard}>
          <img src='/cards/0.png' alt="Other Player's Card" />
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      {renderOtherPlayerCards('top', playerCardCounts.top)}
      {renderOtherPlayerCards('left', playerCardCounts.left)}
      {renderOtherPlayerCards('right', playerCardCounts.right)}

      <div className={styles.middleCards}>
        {middleCards?.map((card, index) => (
          <div key={`middle-${index}`} className={styles.middleCard}>
            <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
          </div>
        ))}
      </div>

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
