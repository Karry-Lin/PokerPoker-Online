'use client';
import { useState } from 'react';
import styles from './Page.module.css';

export default function Chinese_Poker() {
  const [handCards, setHandCards] = useState([
    1, 2, 21, 31, 20, 40, 12, 26, 25, 27, 13, 14,
  ]);
  const [selectedCards, setSelectedCards] = useState([]);
  
  const OtherPlayersCardNumber = [8, 10, 13]; // Cards count for top, left, right players

  // Toggle card selection on click
  const handleCardClick = (card) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(card)
        ? prevSelected.filter((c) => c !== card)
        : [...prevSelected, card]
    );
  };

  // Handle submit button click
  const handleSubmit = () => {
    setHandCards((prevHand) =>
      prevHand.filter((card) => !selectedCards.includes(card))
    );
    setSelectedCards([]);
  };

  return (
    <div className={styles.container}>
      {/* Other players' cards */}
      <div className={styles.topPlayer}>
        {Array.from({ length: OtherPlayersCardNumber[0] }).map((_, index) => (
          <div key={index} className={styles.otherCard}>
            <img src="/cards/0.jpg" alt="Other Player's Card" />
          </div>
        ))}
      </div>

      <div className={styles.leftPlayer}>
        {Array.from({ length: OtherPlayersCardNumber[1] }).map((_, index) => (
          <div key={index} className={styles.otherCard}>
            <img src="/cards/0.jpg" alt="Other Player's Card" />
          </div>
        ))}
      </div>

      <div className={styles.rightPlayer}>
        {Array.from({ length: OtherPlayersCardNumber[2] }).map((_, index) => (
          <div key={index} className={styles.otherCard}>
            <img src="/cards/0.jpg" alt="Other Player's Card" />
          </div>
        ))}
      </div>

      {/* Player's hand cards */}
      <div className={styles.cardRowWrapper}>
        <div className={styles.handCards}>
          {handCards.map((card, index) => (
            <div
              key={index}
              className={`${styles.card} ${
                selectedCards.includes(card) ? styles.selected : ''
              }`}
              onClick={() => handleCardClick(card)}
            >
              <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
            </div>
          ))}
        </div>
        <button className={styles.submitButton} onClick={handleSubmit}>
          出牌
        </button>
      </div>
    </div>
  );
}
