"use client";

import { useEffect, useState } from "react";
import { updateDoc } from "firebase/firestore";
import styles from "./Page.module.css";
import getPoint from "./components/getPoint";

export default function ChineseRummy({ prop }) {
  const { roomRef, roomData, nowCards, players, uid, userplace, turn, deck } =
    prop;

  const [middleCards, setMiddleCards] = useState([]);
  const [handCards, setHandCards] = useState([]);
  const [selectedHandCard, setSelectedHandCard] = useState(null);
  const [selectedMiddleCard, setSelectedMiddleCard] = useState(null);
  const [flipCard, setFlipCard] = useState(null);

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
    setSelectedHandCard(null);
    setSelectedMiddleCard(null);
    setFlipCard(null);
  }, [turn]);

  useEffect(() => {
    setMiddleCards(nowCards);
    console.log('players',players)
    if (players?.length === 4) {
      const getRelativePlayer = (offset) =>
        players.find(
          (player) => player.place === ((userplace + offset) % 4) + 1
        );

      const updatePlayerState = {
        top: getRelativePlayer(1),
        left: getRelativePlayer(0),
        right: getRelativePlayer(2),
        player: players.userplace,
      };

      setPlayerState({
        top: {
          cardCount: updatePlayerState.top?.handCards.length || 0,
          avatar: updatePlayerState.top?.avatar || "/avatar_test.jpg",
          score: updatePlayerState.top?.score || 0,
          name: updatePlayerState.top?.username || "player",
          place: updatePlayerState.top?.place || 0,
        },
        left: {
          cardCount: updatePlayerState.left?.handCards.length || 0,
          avatar: updatePlayerState.left?.avatar || "/avatar_test.jpg",
          score: updatePlayerState.left?.score || 0,
          name: updatePlayerState.left?.username || "player",
          place: updatePlayerState.left?.place || 0,
        },
        right: {
          cardCount: updatePlayerState.right?.handCards.length || 0,
          avatar: updatePlayerState.right?.avatar || "/avatar_test.jpg",
          score: updatePlayerState.right?.score || 0,
          name: updatePlayerState.right?.username || "player",
          place: updatePlayerState.right?.place || 0,
        },
        player: {
          cardCount: players.userplace?.handCards.length || 0,
          avatar: players.userplace?.avatar || "/avatar_test.jpg",
          score: players.userplace?.score || 0,
          name: players.userplace?.username || "player",
          place: updatePlayerState.userplace?.place || 0,
        },
      });
    }
  }, [nowCards, players, userplace]);

  useEffect(() => {
    if (players && uid) {
      const currentPlayer = players.find((player) => player.id === uid);
      setHandCards(currentPlayer?.handCards || []);
    }
  }, [players, uid]);
  useEffect(() => {
    const checkNextState = async () => {
      const areAllPlayersEnd = players.every(
        (player) => player.handCards.length == 0
      );
      if (areAllPlayersEnd) {
        const updatedPlayers = {};
        players.forEach((player) => {
          updatedPlayers[player.id] = {
            ...player,
            ready: false,
            showResult: true,
          };
        });
        await updateDoc(roomRef, {
          state: "waiting",
          isShuffled: false,
          nowCards: [],
          players: updatedPlayers,
        });
      }
    };
    checkNextState();
  }, [nowCards]);

  const handleMiddleCardClick = (card) => {
    if (userplace === turn) {
      setSelectedMiddleCard(card);
    }
  };

  const handleHandCardClick = (card) => {
    if (userplace === turn && !flipCard) {
      setSelectedHandCard(card);
    }
  };

  const handleThrowHandCard = async () => {
    try {
      const updatedHandCards = handCards.filter((c) => c !== selectedHandCard);
      const updatedMiddleCards = [...middleCards, selectedHandCard];

      await updateDoc(roomRef, {
        nowCards: updatedMiddleCards,
        [`players.${uid}.handCards`]: updatedHandCards,
        deck: deck.slice(1),
      });

      setFlipCard(deck[0]);
      setSelectedHandCard(null);
    } catch (error) {
      console.error("Error throwing hand card:", error);
    }
  };

  const handleThrowFlipCard = async () => {
    try {
      const updatedMiddleCards = [...middleCards, flipCard];

      await updateDoc(roomRef, {
        nowCards: updatedMiddleCards,
        turn: (turn % 4) + 1,
        deck: deck.slice(1),
      });

      setFlipCard(null);
      setSelectedMiddleCard(null);
    } catch (error) {
      console.error("Error throwing flip card:", error);
    }
  };

  const handleSubmitFlipCard = async () => {
    try {
      const point = getPoint(flipCard, selectedMiddleCard);
      if (point !== -1) {
        const updatedMiddleCards = middleCards.filter(
          (card) => card !== selectedMiddleCard
        );

        await updateDoc(roomRef, {
          nowCards: updatedMiddleCards,
          turn: (turn % 4) + 1,
          [`players.${uid}.score`]: roomData.players[uid]?.score + point,
          deck: deck.slice(1),
        });

        setSelectedMiddleCard(null);
        setFlipCard(null);
      } else {
        alert("Please select valid cards");
        setSelectedMiddleCard(null);
      }
    } catch (error) {
      console.error("Error submitting flip card:", error);
    }
  };

  const handleSubmit = async () => {
    try {
      const point = getPoint(selectedHandCard, selectedMiddleCard);
      if (point !== -1) {
        const updatedMiddleCards = middleCards.filter(
          (card) => card !== selectedMiddleCard
        );
        const updatedHandCards = handCards.filter(
          (card) => card !== selectedHandCard
        );

        await updateDoc(roomRef, {
          [`players.${uid}.handCards`]: updatedHandCards,
          [`players.${uid}.score`]: roomData.players[uid]?.score + point,
          nowCards: updatedMiddleCards,
          deck: deck.slice(1),
        });

        setSelectedMiddleCard(null);
        setSelectedHandCard(null);
        setFlipCard(deck[0]);
      } else {
        alert("Please select valid cards");
        setSelectedMiddleCard(null);
        setSelectedHandCard(null);
      }
    } catch (error) {
      console.error("Error updating game state:", error);
    }
  };

  const handlePlayCard = () => {
    if (flipCard && selectedMiddleCard) {
      handleSubmitFlipCard();
    } else if (selectedHandCard && selectedMiddleCard) {
      handleSubmit();
    }
  };

  const handleDiscardCard = () => {
    if (flipCard) {
      handleThrowFlipCard();
    } else if (selectedHandCard) {
      handleThrowHandCard();
    }
  };
  const renderOtherPlayer = (position) => {
    const player = playerState[position];
    const isTurn = turn == player.place; // Check if it's this player's turn
    const infoPositionClass = `${styles.playerInfoContainer} ${
      isTurn ? styles.activeTurn : ""
    } ${styles[position + "Info"]}`;

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
      {renderOtherPlayer("top")}
      {renderOtherPlayer("left")}
      {renderOtherPlayer("right")}

      <div className={styles.middleCards}>
        {middleCards?.map((card, index) => (
          <div
            key={`middle-${index}`}
            className={`${styles.card} ${
              selectedMiddleCard === card ? styles.selected : ""
            }`}
            onClick={() => handleMiddleCardClick(card)}
          >
            <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
          </div>
        ))}
      </div>

      <div className={styles.cardRowWrapper}>
        {flipCard && (
          <div className={styles.handCards}>
            <div className={styles.card}>
              <img
                src={`/cards/${flipCard}.png`}
                alt={`Flip Card ${flipCard}`}
              />
            </div>
          </div>
        )}

        <div className={styles.handCards}>
          {handCards?.map((card, index) => (
            <div
              key={`hand-${index}`}
              className={`${styles.card} ${
                selectedHandCard === card ? styles.selected : ""
              }`}
              onClick={() => handleHandCardClick(card)}
            >
              <img src={`/cards/${card}.png`} alt={`Card ${card}`} />
            </div>
          ))}

          <button
            className={
              (flipCard || selectedHandCard) && selectedMiddleCard
                ? styles.submitButton
                : styles.disabledButton
            }
            onClick={handlePlayCard}
            disabled={userplace !== turn}
          >
            出牌
          </button>
          <button
            className={
              (flipCard || selectedHandCard) && !selectedMiddleCard
                ? styles.submitButton
                : styles.disabledButton
            }
            onClick={handleDiscardCard}
            disabled={userplace !== turn}
          >
            丟牌
          </button>
        </div>
      </div>
    </div>
  );
}
