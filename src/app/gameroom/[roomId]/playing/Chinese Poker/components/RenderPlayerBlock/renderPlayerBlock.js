import React from "react";
import styles from "./Page.module.css";

export default function RenderPlayerBlock({ prop }) {
  const { players } = prop;

  // Players divided into positions: top, left, right, bottom
  const topPlayer = players[0];
  const leftPlayer = players[1];
  const rightPlayer = players[2];
  const bottomPlayer = players[3];

  // Helper function to render a player block
  const renderPlayerBlock = (player) => {
    if (!player) return null;

    const showCards = player.showCards || [];
    const avatar = player.avatar;
    const name = player.username;
    const show = player.isPassed;

    const cardRows = [
      showCards.top,
      showCards.middle,
      showCards.bottom,
    ];

    return (
      <div className={styles.playerBlock}>
        <img src={avatar} alt={`${name}'s avatar`} className={styles.avatar} />
        <div className={styles.playerName}>{name}</div>
        <div className={styles.cardContainer}>
          {cardRows.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`${styles.cardRow} ${
                rowIndex === 1
                  ? styles.middleRow
                  : rowIndex === 2
                  ? styles.bottomRow
                  : ""
              }`}
            >
              {row.map((card, cardIndex) => (
                <img
                  key={cardIndex}
                  src={`/cards/${show ? card : 0}.png`}
                  alt={`Card ${show ? card : "back"}`}
                  className={styles.card}
                  style={{ marginLeft: cardIndex > 0 ? "-40px" : "0" }} // Overlap cards in each row
                />
              ))}
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.gameBoard}>
      <div className={styles.topPlayer}>{renderPlayerBlock(topPlayer)}</div>
      <div className={styles.leftPlayer}>{renderPlayerBlock(leftPlayer)}</div>
      <div className={styles.rightPlayer}>{renderPlayerBlock(rightPlayer)}</div>
      <div className={styles.bottomPlayer}>{renderPlayerBlock(bottomPlayer)}</div>
    </div>
  );
}
