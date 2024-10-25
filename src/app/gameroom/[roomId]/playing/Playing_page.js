'use client';
import { useEffect } from 'react';
import BigTwo from './BigTwo/BigTwo';
import ChinesePoker from './Chinese Poker/ChinesePoker';
import ChineseRummy from './Chinese Rummy/ChineseRummy';

export default function PlayingPage({ prop }) {
  // useEffect(() => {
  //   console.log(prop);
  // }, []); 

  return (
    <div>
      {prop?.roomData?.type === 'Big Two' ? (
        <BigTwo prop={prop} />
      ) : prop?.roomData?.type === 'Chinese Poker' ? (
        <ChinesePoker prop={prop} />
      ) : prop?.roomData?.type === 'Chinese Rummy' ? (
        <ChineseRummy prop={prop} />
      ) : prop?.roomData?.type === 'test' ? (
        <ChineseRummy prop={prop} />
      ): (
        <div>Unknown state</div>
      )}
    </div>
  );
}
