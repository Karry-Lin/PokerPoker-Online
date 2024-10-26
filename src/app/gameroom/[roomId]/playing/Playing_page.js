'use client';
import { useEffect } from 'react';
import BigTwo from './BigTwo/BigTwo';
import ChinesePoker from './Chinese Poker/ChinesePoker';
import ChineseRummy from './Chinese Rummy/ChineseRummy';
import Test from './test/Test';
import shuffleCards from './BigTwo/conponents/shuffleCards';
export default function PlayingPage({ prop }) {
  useEffect(() => {
    if(prop?.roomData?.type === 'Big Two'){
      
    }
  }, []); 

  return (
    <div>
      {prop?.roomData?.type === 'Big Two' ? (
        <BigTwo prop={prop} />
      ) : prop?.roomData?.type === 'Chinese Poker' ? (
        <ChinesePoker prop={prop} />
      ) : prop?.roomData?.type === 'Chinese Rummy' ? (
        <ChineseRummy prop={prop} />
      ) : prop?.roomData?.type === 'test' ? (
        <Test prop={prop} />
      ): (
        <div>Unknown state</div>
      )}
    </div>
  );
}
