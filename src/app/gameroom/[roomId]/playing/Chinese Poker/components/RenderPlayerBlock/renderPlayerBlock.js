import React, { useState, useEffect } from "react";
import styles from "./Page.module.css";

export default function RenderPlayerBlock({ prop }) {
  const { players } = prop;
  const [cardRows, setCardRows] = useState([[], [], [], []]);
  const [avatars,setAvatars] = useState(['','','',''])

  useEffect(() => {
    if (players) {
      let arrangedCards = players.map((player) => {
        const handCards = player.handCards || [];
        return [
          handCards.slice(0, 3), // Top row: 3 cards
          handCards.slice(3, 8), // Middle row: 5 cards
          handCards.slice(8, 13), // Bottom row: 5 cards
        ];
      });
      let arrangedAvatar = players.map((player) => {
        const avatar = player.avatar || null;
        return avatar;
      });
      setAvatars(arrangedAvatar);
      setCardRows(arrangedCards)
    }
  }, [players]);
  

  return (
    <div className={styles.container}>
      {/* Render player blocks */}
      {cardRows.map((rows, index) => (
        <div key={index} className={`${styles.playerBlock} ${styles[`player${index}`]}`}>
          {/* Render rows for each player */}
          {rows.map((row, rowIndex) => (
            <div key={rowIndex} className={styles.row}>
              {row.map((card) => (
                <img
                  key={card}
                  src={`/cards/${card}.png`}
                  alt={`Card ${card}`}
                  className={styles.card}
                />
              ))}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
