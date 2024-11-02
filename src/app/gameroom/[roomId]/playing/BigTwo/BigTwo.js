'use client';
import { useEffect, useState } from 'react';
import styles from './Page.module.css';
import shuffleCards from './conponents/shuffleCards';
import { database } from '@/utils/firebase.js';

export default function BigTwo({ prop }) {
  const roomId = prop.id;
  const [middleCard, setMiddleCards] = useState([3, 4, 5, 6, 7]);
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
      <div className={styles.middleCards}>
        {middleCard.map((card, index) => (
          <div key={index} className={styles.middleCard}>
            <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
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
//prop data as follow
// const prop = {
//   id: "a45fe9ce-0004-4fec-8149-54c7761938ed", this is room id
//   nowCards: [3,4,5,6,7], place it as middle card
//   players: [
//     {
//       id: "6e9e6917-ec83-4b12-b2e9-fd7ecb840f73",
//       avatar: "https://firebasestorage.googleapis.com/v0/b/pokerpoker-online.appspot.com/o/userAvatar%2F1728916380593_Circle-103x103-download.png?alt=media&token=ad24e688-20a1-4774-874f-f4fe54b6d3a5",
//       handCards: [],
//       place: 4,
//       ready: true,
//       score: 0,
//       username: "test001"
//     },
//     {
//       id: "726a7cbe-0d00-42ac-a27a-4714a299cd06",
//       avatar: "https://firebasestorage.googleapis.com/v0/b/pokerpoker-online.appspot.com/o/userAvatar%2F1729918669117_%E6%A6%AE%E6%B0%91%E4%B9%8B%E5%AE%B6.png?alt=media&token=77f88b92-560e-4379-8cd8-937da21f2813",
//       handCards: [],
//       place: 2,
//       ready: true,
//       score: 0,
//       username: "test003"
//     },
//     {
//       id: "b8d36589-673c-48a4-8529-6d1062cdcddf",
//       avatar: "https://firebasestorage.googleapis.com/v0/b/pokerpoker-online.appspot.com/o/userAvatar%2F1728983058758_%E9%99%B6%E6%9C%B1%E9%9A%B1%E5%9C%92.jfif?alt=media&token=1064e23d-0058-4b6d-bb0c-cb9785244f21",
//       handCards: [],
//       place: 3,
//       ready: true,
//       score: 0,
//       username: "test002"
//     },
//     {
//       id: "f3f7b67c-6772-4890-9cd6-8d7af4fbcbb1",
//       avatar: "https://firebasestorage.googleapis.com/v0/b/pokerpoker-online.appspot.com/o/userAvatar%2F1729918737075_pika.png?alt=media&token=a20de5bd-1339-47bc-a376-afda0e246515",
//       handCards: [],
//       money: 0,
//       place: 1,
//       ready: true,
//       score: 0,
//       username: "test004"
//     }
//   ],
//   state: "playing",
//   time: "2024-11-01T05:44:45.834Z",
//   turn: 0,
//   type: "大老二"
// };
