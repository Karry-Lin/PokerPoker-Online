import React, { useEffect, useState } from "react";
import { updateDoc } from "firebase/firestore";
import styles from "./Page.module.css";
import countPoint from "../countPoint";

export default function RenderPlayerBlock({ prop }) {
  const { players, userplace, roomRef, startTime } = prop;
  const [allPassed, setAllPassed] = useState(false);
  const [timer, setTimer] = useState(() => {
    if (startTime?.seconds) {
      const now = new Date().getTime() / 1000;
      const elapsedTime = Math.floor(now - startTime.seconds);
      return Math.max(0, 120 - elapsedTime);
    }
    return 120; // Fallback
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => Math.max(0, prev - 1));
    }, 1000);

    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
    // Check if all players have passed
    const everyonePassed =
      players && players.length > 0 && players.every((p) => p.isPassed);

    setAllPassed(everyonePassed);

    // If userplace === 1 and prop exists, we do some counting (original logic)
    if (userplace === 1 && prop) {
      countPoint({ prop });
    }

    // If everyone has passed and we haven't started the timer yet, start it
    if (everyonePassed && timer === null) {
      setTimer(30); // 30 seconds countdown
    }
  }, [prop, players, userplace, timer]);
  const goNext = async () => {
    const updatedPlayers = {};
    players.forEach((player) => {
      updatedPlayers[player.id] = {
        ...player,
        ready: false,
        showResult: true,
        isPassed: false,
      };
    });
    await updateDoc(roomRef, {
      state: "waiting",
      isShuffled: false,
      nowCards: [],
      players: updatedPlayers,
    });
  };
  useEffect(() => {
    let interval = null;
    if (allPassed && timer !== null && timer > 0) {
      // Start a countdown interval if needed
      interval = setInterval(() => {
        setTimer((prev) => {
          const newTime = prev - 1;
          if (newTime === 0) {
            // When timer hits 0, alert 'end'
            goNext();
          }
          return newTime;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [allPassed, timer]);

  // Players divided into positions: top, left, right, bottom
  const topPlayer = players?.[0];
  const leftPlayer = players?.[1];
  const rightPlayer = players?.[2];
  const bottomPlayer = players?.[3];

  // Since we only show cards after all players have passed, we use 'allPassed' instead of 'player.isPassed'
  const renderPlayerBlock = (player) => {
    if (!player) return null;
    const showCards = player.showCards || [];
    const avatar = player.avatar;
    const name = player.username;

    // If we only show cards after all have passed, 'show' depends on allPassed
    const show = allPassed;

    const cardRows = [
      showCards.top || [0, 0, 0],
      showCards.middle || [0, 0, 0, 0, 0],
      showCards.bottom || [0, 0, 0, 0, 0],
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
                  style={{ marginLeft: cardIndex > 0 ? "-40px" : "0" }}
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
      {allPassed && timer !== null && (
        <div
          style={{
            position: "absolute",
            top: "10px",
            right: "10px",
            background: "rgba(0,0,0,0.7)",
            padding: "5px 10px",
            borderRadius: "5px",
            color: "white",
          }}
        >
          Time remaining: {timer}s
        </div>
      )}

      <div className={styles.topPlayer}>{renderPlayerBlock(topPlayer)}</div>
      <div className={styles.leftPlayer}>{renderPlayerBlock(leftPlayer)}</div>
      <div className={styles.rightPlayer}>{renderPlayerBlock(rightPlayer)}</div>
      <div className={styles.bottomPlayer}>
        {renderPlayerBlock(bottomPlayer)}
      </div>

    </div>
  );
}
