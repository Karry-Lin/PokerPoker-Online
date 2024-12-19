import React, { useEffect, useState } from "react";
import { updateDoc } from "firebase/firestore";
import styles from "./Page.module.css";
import countPoint from "../countPoint";

export default function RenderPlayerBlock({ prop }) {
  const { players, userplace, roomRef, uid ,calculated} = prop;
  const [allPassed, setAllPassed] = useState(false);

  useEffect(() => {
    const everyonePassed =
      players && players.length > 0 && players.every((p) => p.isPassed);
    setAllPassed(everyonePassed);
  }, [players]);

  useEffect(() => {
    const calculate = async () => {
      countPoint({ prop });
      // await updateDoc(roomRef, { players: updatedPlayers });
    };
    // console.log(prop)
    if (userplace == 1 && allPassed && !calculated) {
      calculate();
    }
    //
  }, [allPassed]);

  const goNext = async () => {
    const updatedPlayers = {};
    const initRows = { top: [], middle: [], bottom: [] };
    players.forEach((player) => {
      updatedPlayers[player.id] = {
        ...player,
        ready: false,
        showResult: true,
        isPassed: false,
        rows: initRows,
      };
    });
    await updateDoc(roomRef, {
      state: "waiting",
      isShuffled: false,
      nowCards: [],
      players: updatedPlayers,
    });
  };

  const topPlayer = players?.[0];
  const leftPlayer = players?.[1];
  const rightPlayer = players?.[2];
  const bottomPlayer = players?.[3];

  const renderPlayerBlock = (player) => {
    if (!player) return null;
    const showCards = player.showCards || [];
    const avatar = player.avatar;
    const name = player.username;
    const score = player.score || 0; // show score if available
    const show = allPassed; // Show cards only if all passed
  
    const cardRows = [
      showCards.top || [0, 0, 0],
      showCards.middle || [0, 0, 0, 0, 0],
      showCards.bottom || [0, 0, 0, 0, 0],
    ];
    
    return (
      <div className={styles.playerBlock}>
        <img src={avatar} alt={`${name}'s avatar`} className={styles.avatar} />
        <div className={styles.playerInfo}>
          <div className={styles.playerName}>{name}</div>
          <div className={styles.playerScore}>Score: {score}</div>
        </div>
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
      <div className={styles.topPlayer}>{renderPlayerBlock(topPlayer)}</div>
      <div className={styles.leftPlayer}>{renderPlayerBlock(leftPlayer)}</div>
      <div className={styles.rightPlayer}>{renderPlayerBlock(rightPlayer)}</div>
      <div className={styles.bottomPlayer}>
        {renderPlayerBlock(bottomPlayer)}
      </div>
      <button className={styles.submitButton} onClick={goNext}>
        結算
      </button>
    </div>
  );
}

// import React, { useEffect, useState } from "react";
// import { updateDoc } from "firebase/firestore";
// import styles from "./Page.module.css";
// import countPoint from "../countPoint";

// export default function RenderPlayerBlock({ prop }) {
//   const { players, userplace, roomRef, startTime } = prop;
//   const [allPassed, setAllPassed] = useState(false);

// const [timer, setTimer] = useState(() => {
//   if (startTime) {
//     const now = Date.now();
//     const elapsedTime = Math.floor((now - startTime.toMillis()) / 1000);
//     return Math.max(0, 180 - elapsedTime);
//   }
//   return 180;
// });

// useEffect(() => {
// Decrement timer every second if timer > 0 and not allPassed
//   if (!allPassed && timer > 0) {
//     const interval = setInterval(() => {
//       setTimer((prev) => Math.max(0, prev - 1));
//     }, 1000);
//     return () => clearInterval(interval);
//   }
// }, [allPassed, timer]);

// useEffect(() => {
//   // Check if all players have passed
//   const everyonePassed =
//     players && players.length > 0 && players.every((p) => p.isPassed);

//   setAllPassed(everyonePassed);

//   // If userplace === 1 and prop exists, we do some counting
//   if (userplace === 1 && prop) {
//     console.log('call')
//     countPoint({ prop });
//   }

//   // If everyone has passed, start a new 30-second timer if needed
//   // For example, if we want a fresh 30-second countdown once everyone passes:
//   // if (everyonePassed && timer > 30) {
//   //   setTimer(30);
//   // }
// }, [prop, players, userplace]);

// const goNext = async () => {
//   const updatedPlayers = {};
//   const initRows = { top: [], middle: [], bottom: [] };
//   players.forEach((player) => {
//     updatedPlayers[player.id] = {
//       ...player,
//       ready: false,
//       showResult: true,
//       isPassed: false,
//       rows: initRows,
//     };
//   });
//   await updateDoc(roomRef, {
//     state: "waiting",
//     isShuffled: false,
//     nowCards: [],
//     players: updatedPlayers,
//   });
// };

// useEffect(() => {
//   let interval = null;
//   // If all have passed and timer is running, start a countdown
//   if (allPassed && timer > 0) {
//     interval = setInterval(() => {
//       setTimer((prev) => {
//         const newTime = prev - 1;
//         if (newTime === 0) {
//           // When timer hits 0, goNext
//           goNext();
//         }
//         return newTime;
//       });
//     }, 1000);
//   }

//   return () => {
//     if (interval) clearInterval(interval);
//   };
// }, [allPassed, timer]);

//   const topPlayer = players?.[0];
//   const leftPlayer = players?.[1];
//   const rightPlayer = players?.[2];
//   const bottomPlayer = players?.[3];

//   const renderPlayerBlock = (player) => {
//     if (!player) return null;
//     const showCards = player.showCards || [];
//     const avatar = player.avatar;
//     const name = player.username;
//     const show = allPassed;

//     const cardRows = [
//       showCards.top || [0, 0, 0],
//       showCards.middle || [0, 0, 0, 0, 0],
//       showCards.bottom || [0, 0, 0, 0, 0],
//     ];

//     return (
//       <div className={styles.playerBlock}>
//         <img src={avatar} alt={`${name}'s avatar`} className={styles.avatar} />
//         <div className={styles.playerName}>{name}</div>
//         <div className={styles.cardContainer}>
//           {cardRows.map((row, rowIndex) => (
//             <div
//               key={rowIndex}
//               className={`${styles.cardRow} ${
//                 rowIndex === 1
//                   ? styles.middleRow
//                   : rowIndex === 2
//                   ? styles.bottomRow
//                   : ""
//               }`}
//             >
//               {row.map((card, cardIndex) => (
//                 <img
//                   key={cardIndex}
//                   src={`/cards/${show ? card : 0}.png`}
//                   alt={`Card ${show ? card : "back"}`}
//                   className={styles.card}
//                   style={{ marginLeft: cardIndex > 0 ? "-40px" : "0" }}
//                 />
//               ))}
//             </div>
//           ))}
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className={styles.gameBoard}>
//       {allPassed && timer > 0 && (
//         <div
//           style={{
//             position: "absolute",
//             top: "10px",
//             right: "10px",
//             background: "rgba(0,0,0,0.7)",
//             padding: "5px 10px",
//             borderRadius: "5px",
//             color: "white",
//           }}
//         >
//           Time remaining: {timer}s
//         </div>
//       )}

//       <div className={styles.topPlayer}>{renderPlayerBlock(topPlayer)}</div>
//       <div className={styles.leftPlayer}>{renderPlayerBlock(leftPlayer)}</div>
//       <div className={styles.rightPlayer}>{renderPlayerBlock(rightPlayer)}</div>
//       <div className={styles.bottomPlayer}>
//         {renderPlayerBlock(bottomPlayer)}
//       </div>
//       <button className={styles.submitButton} onClick={goNext}>
//         Submit
//       </button>
//     </div>
//   );
// }
