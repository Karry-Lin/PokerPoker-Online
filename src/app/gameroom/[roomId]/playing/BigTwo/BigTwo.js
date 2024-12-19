"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "./Page.module.css";
import compare from "./components/compare";
import get_point from "./components/get_point";

export default function BigTwo({ prop }) {
  console.log(prop);
  const {
    roomRef,
    roomData,
    nowCards,
    players,
    uid,
    userplace,
    turn,
    isPassed,
    database
  } = prop;
  const [middleCards, setMiddleCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);

  const [playerState, setPlayerState] = useState({
    top: {
      cardCount: 13,
      avatar: "/avatar_test.jpg",
      score: 0,
      name: "player",
    },
    left: {
      cardCount: 13,
      avatar: "/avatar_test.jpg",
      score: 0,
      name: "player",
    },
    right: {
      cardCount: 13,
      avatar: "/avatar_test.jpg",
      score: 0,
      name: "player",
    },
    player: {
      cardCount: 13,
      avatar: "/avatar_test.jpg",
      score: 0,
      name: "player",
    },
  });

  useEffect(() => {
    setMiddleCards(nowCards);
    // console.log('players',players)
    if (players?.length === 4) {
      const getRelativePlayer = (offset) =>
        players.find(
          (player) => player.place === ((userplace + offset) % 4) + 1
        );

      const updatePlayerState = {
        top: getRelativePlayer(1),
        left: getRelativePlayer(0),
        right: getRelativePlayer(2),
        player: getRelativePlayer(3),
      };

      setPlayerState({
        top: {
          cardCount: updatePlayerState.top?.handCards.length || 0,
          avatar: updatePlayerState.top?.avatar || "/avatar_test.jpg",
          score: updatePlayerState.top?.score || 0,
          money: updatePlayerState.top?.money || 0,
          name: updatePlayerState.top?.username || "player",
          place: updatePlayerState.top?.place || 0,
          pass: updatePlayerState.top?.isPassed || false,
        },
        left: {
          cardCount: updatePlayerState.left?.handCards.length || 0,
          avatar: updatePlayerState.left?.avatar || "/avatar_test.jpg",
          score: updatePlayerState.left?.score || 0,
          money: updatePlayerState.left?.money || 0,
          name: updatePlayerState.left?.username || "player",
          place: updatePlayerState.left?.place || 0,
          pass: updatePlayerState.left?.isPassed || false,
        },
        right: {
          cardCount: updatePlayerState.right?.handCards.length || 0,
          avatar: updatePlayerState.right?.avatar || "/avatar_test.jpg",
          score: updatePlayerState.right?.score || 0,
          money: updatePlayerState.left?.money || 0,
          name: updatePlayerState.right?.username || "player",
          place: updatePlayerState.right?.place || 0,
          pass: updatePlayerState.right?.isPassed || false,
        },
        player: {
          cardCount: updatePlayerState.player?.handCards.length || 0,
          avatar: updatePlayerState.player.avatar || "/avatar_test.jpg",
          score: updatePlayerState.player?.score || 0,
          money: updatePlayerState.player?.money || 0,
          name: updatePlayerState.player?.username || "player",
          place: updatePlayerState.player?.place || 0,
          pass: updatePlayerState.player?.isPassed || false,
        },
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
  useEffect(() => {
    const resetIsPassed = async () => {
      const updatedPlayers = {};
      players.forEach((player) => {
        updatedPlayers[player.id] = { ...player, isPassed: false };
      });

      await updateDoc(roomRef, {
        ...roomData,
        players: updatedPlayers,
        nowCards: [],
      });
    };
    const pass = async () => {
      await updateDoc(roomRef, {
        turn: (turn % 4) + 1,
      });
    };
    if (isPassed && turn == userplace) {
      pass();
    }
    // console.log('prop.startTurn', prop.startTurn);
    if (prop.startTurn == turn) {
      resetIsPassed();
    }
  }, [turn]);

  const handleCardClick = (card) => {
    setSelectedCards((prevSelected) =>
      prevSelected.includes(card)
        ? prevSelected.filter((c) => c !== card)
        : [...prevSelected, card]
    );
  };

  const handlePass = async () => {
    await updateDoc(roomRef, {
      turn: (turn % 4) + 1,
      [`players.${uid}.isPassed`]: true,
    });
  };
  const handleSubmit = async () => {
    if (!compare(selectedCards, middleCards)) {
      console.log("Invalid card combination");
      alert("請出有效的牌");
      return;
    }

    try {
      if (!roomData.players || roomData.players.uid === -1) {
        throw new Error("Invalid player data");
      }

      const updatedHandCards = handCards.filter(
        (card) => !selectedCards.includes(card)
      );

      await updateDoc(roomRef, {
        [`players.${uid}.handCards`]: updatedHandCards,
        nowCards: selectedCards,
        startTurn: userplace,
        turn: (turn % 4) + 1,
      });

      setHandCards(updatedHandCards);
      setSelectedCards([]);
      if (updatedHandCards.length === 0) {
        const updatedPlayers = {};
        let totalWinPoints = 0;
      
        // First, calculate scores and update players in a batch
        const playerUpdates = players.map((player) => {
          const playerScore = get_point(player.handCards);
          const playerMoney = player.money + playerScore * 5;
      
          totalWinPoints += playerScore;
      
          updatedPlayers[player.id] = {
            ...player,
            ready: false,
            score: playerScore,
            money: playerMoney,
            showResult: true,
            isPassed: false,
          };
      
          return {
            id: player.id,
            money: playerMoney,
          };
        });
      
        // Subtract win points for the current user
        totalWinPoints -= updatedPlayers[uid]?.score || 0;
        updatedPlayers[uid].money -= totalWinPoints * 5;
        updatedPlayers[uid].score = -totalWinPoints;
      
        // Perform database updates in a batch
        const dbPromises = playerUpdates.map(({ id, money }) => {
          const userRef = doc(database, `user/${id}`);
          return updateDoc(userRef, { money });
        });
      
        // Update the current user
        const userRef = doc(database, `user/${uid}`);
        dbPromises.push(
          updateDoc(userRef, {
            money: updatedPlayers[uid].money,
          })
        );
      
        // Update room state
        dbPromises.push(
          updateDoc(roomRef, {
            state: "waiting",
            isShuffled: false,
            nowCards: [],
            players: updatedPlayers,
          })
        );
      
        // Wait for all updates to complete
        await Promise.all(dbPromises);
      }
      
    } catch (error) {
      console.error("Error updating game state:", error);
    }
  };
  const renderOtherPlayer = (position) => {
    const player = playerState[position];
    const isTurn = turn == player.place; // Check if it's this player's turn
    const infoPositionClass = `${styles.playerInfoContainer} ${
      isTurn ? styles.activeTurn : ""
    }${player.pass ? styles.passedTurn : ""} ${styles[position + "Info"]}`;

    return (
      <div className={styles[`${position}Player`]}>
        <div className={infoPositionClass}>
          <img
            src={player.avatar}
            alt={`${position} Player Avatar`}
            className={styles.avatar}
          />
          <div className={styles.playerDetails}>
            <div className={styles.playerName}>{player.name}</div>
            <div className={styles.playerScore}>Score: {player.score}</div>
            <div className={styles.playerCardsCount}>
              Cards: {player.cardCount}
            </div>
          </div>
        </div>
        <div className={styles.otherCardsContainer}>
          {Array.from({ length: player.cardCount }).map((_, index) => (
            <div key={`${position}-${index}`} className={styles.otherCard}>
              <img src="/cards/0.png" alt="Other Player's Card" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      {/* Other players' cards */}
      {renderOtherPlayer("top")}
      {renderOtherPlayer("left")}
      {renderOtherPlayer("right")}

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
        <div
          className={`${styles.playerInfoContainer} ${
            userplace === turn ? styles.activeTurn : ""
          }${isPassed ? styles.passedTurn : ""}`}
        >
          <img
            src={playerState.player.avatar}
            alt="Player Avatar"
            className={styles.avatar}
          />
          <div className={styles.playerDetails}>
            <div className={styles.playerName}>{playerState.player.name}</div>
            <div className={styles.playerScore}>
              Score: {playerState.player.score}
            </div>
            <div className={styles.playerCardsCount}>
              Cards: {playerState.player.cardCount}
            </div>
          </div>
        </div>
        <div className={styles.handCards}>
          {handCards.map((card, index) => (
            <div
              key={`hand-${index}`}
              className={`${styles.card} ${
                selectedCards.includes(card) ? styles.selected : ""
              }`}
              onClick={() => handleCardClick(card)}
            >
              <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
            </div>
          ))}
        </div>
        <button
          className={`${styles.submitButton} ${
            userplace !== turn ? styles.disabledButton : ""
          }`}
          onClick={userplace === turn ? handleSubmit : undefined}
          disabled={userplace !== turn || selectedCards.length === 0}
        >
          出牌
        </button>
        <button
          className={`${styles.submitButton} ${
            userplace !== turn ? styles.disabledButton : ""
          }`}
          onClick={userplace === turn ? handlePass : undefined}
          disabled={userplace !== turn}
        >
          過牌
        </button>
      </div>
    </div>
  );
}
