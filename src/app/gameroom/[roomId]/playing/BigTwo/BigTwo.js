"use client";

import { useEffect, useState } from "react";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import styles from "./Page.module.css";
import { database } from "@/utils/firebase.js";
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
  } = prop;
  const [middleCards, setMiddleCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [selectedCards, setSelectedCards] = useState([]);
  const [playerCardCounts, setPlayerCardCounts] = useState({
    top: 13,
    left: 13,
    right: 13,
  });

  useEffect(() => {
    setMiddleCards(nowCards);
    if (players?.length === 4) {
      const getRelativePlayer = (offset) =>
        players.find(
          (player) => player.place === ((userplace + offset) % 4) + 1
        );

      const leftPlayer = getRelativePlayer(1);
      const topPlayer = getRelativePlayer(2);
      const rightPlayer = getRelativePlayer(3);

      setPlayerCardCounts({
        top: topPlayer?.handCards.length || 0,
        left: leftPlayer?.handCards.length || 0,
        right: rightPlayer?.handCards.length || 0,
      });
    }
  }, [nowCards]);

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
        players.forEach((player) => {
          updatedPlayers[player.id] = {
            ...player,
            ready: false,
            score: get_point(player.handCards),
            showResult:true
          };
        });
        await updateDoc(roomRef, {
          state: "waiting",
          isShuffled:false,
          nowCards:[],
          players: updatedPlayers,
        });
      }
    } catch (error) {
      console.error("Error updating game state:", error);
    }
  };

  const renderOtherPlayerCards = (position, count) => (
    <div className={styles[`${position}Player`]}>
      {Array.from({ length: count }).map((_, index) => (
        <div key={`${position}-${index}`} className={styles.otherCard}>
          <img src="/cards/0.png" alt="Other Player's Card" />
        </div>
      ))}
    </div>
  );

  return (
    <div className={styles.container}>
      {/* Other players' cards */}
      {renderOtherPlayerCards("top", playerCardCounts.top)}
      {renderOtherPlayerCards("left", playerCardCounts.left)}
      {renderOtherPlayerCards("right", playerCardCounts.right)}

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
