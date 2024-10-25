'use client';
import { useEffect } from 'react';
import BigTwo from './BigTwo/big_two';
import ChinesePoker from './Chinese Poker/chinese_poker';
import ChineseRummy from './Chinese Rummy/chinese_rummy';

export default function PlayingPage({ prop }) {
  useEffect(() => {
    console.log(prop);
  }, []); // Empty dependency array to run once on mount

  return (
    <div>
      {prop && prop.roomData ? (
        prop.roomData.type === 'Big Two' ? (
          <BigTwo prop={prop} />
        ) : prop.roomData.type === 'Chinese Poker' ? (
          <ChinesePoker prop={prop} />
        ) : prop.roomData.type === 'Chinese Rummy' ? (
          <ChineseRummy prop={prop} />
        ) : (
          <div>Unknown state</div>
        )
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
}
