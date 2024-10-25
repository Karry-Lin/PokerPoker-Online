'use client';
import { useEffect, useState } from 'react';
import styles from './Page.module.css';

export default function Test() {
  const prop = {
    currentUser: {
      avatar:
        'https://firebasestorage.googleapis.com/v0/b/pokerpoker-online.appspot.com/o/userAvatar%2F1728983058758_%E9%99%B6%E6%9C%B1%E9%9A%B1%E5%9C%92.jfif?alt=media&token=1064e23d-0058-4b6d-bb0c-cb9785244f21',
      email: 'test002@gmail.com',
      money: 250,
      username: 'test002'
    },
    roomData: {
      id: '465513ea-24a4-463f-9cce-29dde88e6c0f',
      maxPlayer: 4,
      name: 'number6',
      nowCards: [],//mean the cards on the middle table
      players: {
        'b8d36589-673c-48a4-8529-6d1062cdcddf': {
          handCards:[],
          place:1,
          score:null
        },
        'left_player_id': {
          handCards:[],
          place:2,
          score:null
        },
        'right_player_id': {
          handCards:[],
          place:3,
          score:null
        },
        'top_player_id': {
          handCards:[],
          place:4,
          score:null
        }
      },
      state: 'playing',
    }
  };

  const [handCards, setHandCards] = useState([
    1, 2, 21, 31, 20, 40, 12, 26, 25, 27, 13, 14
  ]);
  const [selectedCards, setSelectedCards] = useState([]);

  const OtherPlayersCardNumber = [8, 10, 13];

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
            <img src='/cards/0.jpg' alt="Other Player's Card" />
          </div>
        ))}
      </div>

      <div className={styles.leftPlayer}>
        {Array.from({ length: OtherPlayersCardNumber[1] }).map((_, index) => (
          <div key={index} className={styles.otherCard}>
            <img src='/cards/0.jpg' alt="Other Player's Card" />
          </div>
        ))}
      </div>

      <div className={styles.rightPlayer}>
        {Array.from({ length: OtherPlayersCardNumber[2] }).map((_, index) => (
          <div key={index} className={styles.otherCard}>
            <img src='/cards/0.jpg' alt="Other Player's Card" />
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
          Submit
        </button>
      </div>
    </div>
  );
}
