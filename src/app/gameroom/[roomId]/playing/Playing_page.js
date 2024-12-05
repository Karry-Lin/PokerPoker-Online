"use client";
import { useEffect } from "react";
import BigTwo from "./BigTwo/BigTwo";
import ChinesePoker from "./Chinese Poker/ChinesePoker";
import ChineseRummy from "./Chinese Rummy/ChineseRummy";
import Test from "./test/Test";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { database } from "@/utils/firebase.js";
import BigTwoShuffleCards from "./BigTwo/components/BigTwoShuffleCards";
import ChineseRummyShuffleCards from "./Chinese Rummy/components/ChineseRummyShuffleCards";
import ChinesePokerShuffleCards from "./Chinese Poker/components/ChinesePokerShuffleCards";
export default function PlayingPage({ prop }) {
  const { roomRef, roomData } = prop;

  useEffect(() => {
    if (prop?.type == "大老二") {
      const shuffle = async () => {
        if (!prop.isShuffled) {
          try {
            const deck = BigTwoShuffleCards();
            const { players } = roomData;
            const playerIds = Object.keys(players);
            const updatedPlayers = {};

            // Find who has card 41 (3♦) while distributing cards
            let startingPlayerId = null;

            playerIds.forEach((playerId, index) => {
              const startIdx = index * 13;
              const endIdx = startIdx + 13;
              const playerCards = deck.slice(startIdx, endIdx);

              if (playerCards.includes(42)) {
                startingPlayerId = playerId;
              }

              updatedPlayers[playerId] = {
                ...players[playerId],
                handCards: playerCards,
              };
            });
            await setDoc(roomRef, {
              ...roomData,
              players: updatedPlayers,
              isShuffled: true,
              turn: players[startingPlayerId].place,
            });
          } catch (error) {
            console.error("Error updating game state:", error);
          }
        }
      };
      shuffle();
    } else if (prop?.type == "撿紅點") {
      const shuffle = async () => {
        if (!prop.isShuffled) {
          try {
            const deck = ChineseRummyShuffleCards();
            const { players } = roomData;
            const playerIds = Object.keys(players);
            const updatedPlayers = {};
            playerIds.forEach((playerId, index) => {
              const startIdx = index * 4;
              const endIdx = startIdx + 4;
              const playerCards = deck.slice(startIdx, endIdx);
              updatedPlayers[playerId] = {
                ...players[playerId],
                handCards: playerCards,
              };
            });
            await setDoc(roomRef, {
              ...roomData,
              players: updatedPlayers,
              isShuffled: true,
              turn:1,
              nowCards:deck.slice(16, 20),
              deck:deck.slice(20, 52)
            });
          } catch (error) {
            console.error("Error updating game state:", error);
          }
        }
      };
      shuffle();
    } else if (prop?.type == "十三支") {
      const shuffle = async () => {
        if (!prop.isShuffled) {
          try {
            const deck = ChinesePokerShuffleCards();
            const { players } = roomData;
            const playerIds = Object.keys(players);
            const updatedPlayers = {};

            playerIds.forEach((playerId, index) => {
              const startIdx = index * 13;
              const endIdx = startIdx + 13;
              const playerCards = deck.slice(startIdx, endIdx);

              updatedPlayers[playerId] = {
                ...players[playerId],
                handCards: playerCards,
              };
            });
            await setDoc(roomRef, {
              ...roomData,
              players: updatedPlayers,
              isShuffled: true,
              startTurn: players[startingPlayerId].place,
            });
          } catch (error) {
            console.error("Error updating game state:", error);
          }
        }
      };
      shuffle();
    }
  }, [prop]);

  if (!prop?.type) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full">
      {prop?.type == "大老二" ? (
        <BigTwo prop={prop} />
      ) : prop?.type == "十三支" ? (
        <ChinesePoker prop={prop} />
      ) : prop?.type == "撿紅點" ? (
        <ChineseRummy prop={prop} />
      ) : prop?.type == "test" ? (
        <Test prop={prop} />
      ) : (
        <div>Error: Invalid game type</div>
      )}
    </div>
  );
}
