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
            // console.log('check1',playerIds)
            // Create updated players object with distributed cards
            const updatedPlayers = {};
            playerIds.forEach((playerId, index) => {
              const startIdx = index * 13;
              const endIdx = startIdx + 13;
              updatedPlayers[playerId] = {
                ...players[playerId],
                handCards: deck.slice(startIdx, endIdx)
              };
            });
            await setDoc(roomRef, {
              ...roomData,
              players: updatedPlayers,
              isShuffled: true
            });
            // console.log('prop:', prop);
            // console.log('finish shuffle');
          } catch (error) {
            console.error('Error updating game state:', error);
          }
        }
      };
      shuffle();
    } else if (prop?.type == '十三支') {
    } else if (prop?.type == '撿紅點') {
    }
  }, [prop]);

  return (
    <div>
      {prop?.type == '大老二' ? (
        <BigTwo prop={prop} />
      ) : prop?.type == '十三支' ? (
        <ChinesePoker prop={prop} />
      ) : prop?.type == '撿紅點' ? (
        <ChineseRummy prop={prop} />
      ) : prop?.type == 'test' ? (
        <Test prop={prop} />
      ) : (
        <div>die in playing room</div>
      )}
    </div>
  );
}
