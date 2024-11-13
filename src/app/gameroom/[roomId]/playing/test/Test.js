'use client';

import { useEffect, useState } from 'react';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import styles from './Page.module.css';
import getPoint from './components/getPoint';

export default function test({ prop }) {
  const { roomRef, roomData, nowCards, players, uid, userplace, turn, deck } = prop;
  const [middleCards, setMiddleCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [selectedHandCard, setSelectedHandCard] = useState(null);
  const [selectedMiddleCard, setSelectedMiddleCard] = useState(null);
  const [flipCard, setFlipCard] = useState(null);

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

  const handleMiddleCardClick = (card) => {
    setSelectedMiddleCard(card);
  };

  const handleHandCardClick = (card) => {
    setSelectedHandCard(card);
  };

  const handleThrowHandCard = async (card) => {
    try {
      // Remove the thrown card from player's hand
      const updatedHandCards = handCards.filter(c => c !== selectedHandCard);
      // Add the thrown card to middle cards
      const updatedMiddleCards = [...middleCards, selectedHandCard];
      
      await updateDoc(roomRef, {
        nowCards: updatedMiddleCards,
        [`players.${uid}.handCards`]: updatedHandCards,
        // Remove top card from deck and update deck
        deck: deck.slice(1)
      });

      setFlipCard(deck[0]);
      setSelectedHandCard(null);
    } catch (error) {
      console.error('Error throwing hand card:', error);
    }
  };

  const handleThrowFlipCard = async () => {
    try {
      // Add flip card to middle cards
      const updatedMiddleCards = [...middleCards, flipCard];
      
      await updateDoc(roomRef, {
        nowCards: updatedMiddleCards,
        turn: (turn + 1) % 4,
        // Remove top card from deck
        deck: deck.slice(1)
      });

      setFlipCard(null);
    } catch (error) {
      console.error('Error throwing flip card:', error);
    }
  };

  const handleSubmitFlipCard = async () => {
    try {
      if (!roomData.players || roomData.players.uid === -1) {
        throw new Error('Invalid player data');
      }

      const point = getPoint(flipCard, selectedMiddleCard);
      if (point !== -1) {
        // Remove matched cards from middle cards
        const updatedMiddleCards = middleCards.filter(card => !selectedMiddleCard.includes(card));
        
        // Update player's score and game state
        await updateDoc(roomRef, {
          nowCards: updatedMiddleCards,
          turn: (turn + 1) % 4,
          [`players.${uid}.score`]: roomData.players[uid].score + point,
          deck: deck.slice(1)
        });

        setSelectedMiddleCard(null);
        setFlipCard(null);
      }
    } catch (error) {
      console.error('Error submitting flip card:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      if (!roomData.players || roomData.players.uid === -1) {
        throw new Error('Invalid player data');
      }

      const point = getPoint(selectedHandCard, selectedMiddleCard);
      if (point !== -1) {
        // Remove matched cards from middle cards and hand
        const updatedMiddleCards = middleCards.filter(card => !selectedMiddleCard.includes(card));
        const updatedHandCards = handCards.filter(card => card !== selectedHandCard);
        
        await updateDoc(roomRef, {
          [`players.${uid}.handCards`]: updatedHandCards,
          [`players.${uid}.score`]: roomData.players[uid].score + point,
          nowCards: updatedMiddleCards,
          turn: (turn + 1) % 4
        });

        setSelectedMiddleCard(null);
        setSelectedHandCard(null);
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
      {renderOtherPlayerCards('top', playerCardCounts.top)}
      {renderOtherPlayerCards('left', playerCardCounts.left)}
      {renderOtherPlayerCards('right', playerCardCounts.right)}

      <div className={styles.middleCards}>
        {middleCards?.map((card, index) => (
          <div
            key={`middle-${index}`}
            className={`${styles.card} ${
              selectedMiddleCard?.includes(card) ? styles.selected : ''
            }`}
            onClick={() => handleMiddleCardClick(card)}
          >
            <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
          </div>
        ))}
      </div>

      <div className={styles.cardRowWrapper}>
        <div className={styles.handCards}>
          {handCards?.map((card, index) => (
            <div
              key={`hand-${index}`}
              className={`${styles.card} ${
                selectedHandCard?.includes(card) ? styles.selected : ''
              }`}
              onClick={() => handleHandCardClick(card)}
            >
              <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
            </div>
          ))}
        </div>
        {userplace === turn && (
          <>
            {selectedHandCard && selectedMiddleCard && (
              <button className={styles.submitButton} onClick={handleSubmit}>
                Submit
              </button>
            )}
            {selectedHandCard && (
              <button className={styles.submitButton} onClick={handleThrowHandCard}>
                Throw
              </button>
            )}
            {flipCard && selectedMiddleCard && (
              <button className={styles.submitButton} onClick={handleSubmitFlipCard}>
                Submit
              </button>
            )}
            {flipCard && !selectedMiddleCard && (
              <button className={styles.submitButton} onClick={handleThrowFlipCard}>
                Throw
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}