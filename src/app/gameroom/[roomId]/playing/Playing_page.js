'use client';
import { useEffect } from 'react';
import BigTwo from './BigTwo/BigTwo';
import ChinesePoker from './Chinese Poker/ChinesePoker';
import ChineseRummy from './Chinese Rummy/ChineseRummy';
import Test from './test/Test';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { database } from '@/utils/firebase.js';
import shuffleCards from './BigTwo/components/shuffleCards';

export default function PlayingPage({ prop }) {
  const { roomRef, roomData } = prop;

  useEffect(() => {
    if (prop?.type == '大老二') {
      const shuffle = async () => {
        if (!prop.isShuffled) {
          try {
            const deck = shuffleCards();
            const { players } = roomData;
            const playerIds = Object.keys(players);
            const updatedPlayers = {};
            
            // Find who has card 41 (3♦) while distributing cards
            let startingPlayerId = null;
            
            playerIds.forEach((playerId, index) => {
              const startIdx = index * 13;
              const endIdx = startIdx + 13;
              const playerCards = deck.slice(startIdx, endIdx);
              
              // Check if this player has card 41 (3♦)
              if (playerCards.includes(41)) {
                startingPlayerId = playerId;
              }
              
              updatedPlayers[playerId] = {
                ...players[playerId],
                handCards: playerCards
              };
            });

            if (!startingPlayerId) {
              console.error('Card 41 not found in deck');
              return;
            }

            await setDoc(roomRef, {
              ...roomData,
              players: updatedPlayers,
              isShuffled: true,
              turn: startingPlayerId // Set turn to the player with card 41
            });
          } catch (error) {
            console.error('Error updating game state:', error);
          }
        }
      };
      shuffle();
    } else if (prop?.type == '十三支') {
      // Chinese Poker initialization logic
    } else if (prop?.type == '撿紅點') {
      // Chinese Rummy initialization logic
    }
  }, [prop]);

  if (!prop?.type) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full h-full">
      {prop?.type == '大老二' ? (
        <BigTwo prop={prop} />
      ) : prop?.type == '十三支' ? (
        <ChinesePoker prop={prop} />
      ) : prop?.type == '撿紅點' ? (
        <ChineseRummy prop={prop} />
      ) : prop?.type == 'test' ? (
        <Test prop={prop} />
      ) : (
        <div>Error: Invalid game type</div>
      )}
    </div>
  );
}
