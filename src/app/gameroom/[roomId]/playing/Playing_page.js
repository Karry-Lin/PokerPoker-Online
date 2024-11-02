'use client';
import { useEffect } from 'react';
import BigTwo from './BigTwo/BigTwo';
import ChinesePoker from './Chinese Poker/ChinesePoker';
import ChineseRummy from './Chinese Rummy/ChineseRummy';
import Test from './test/Test';
import shuffleCards from './BigTwo/conponents/shuffleCards';
export default function PlayingPage({ prop }) {
  // useEffect(() => {
  //   console.log('porp:',prop)
  // }, [prop]);
  useEffect(() => {
    if(prop?.type == '大老二'){
      
    }else if(prop?.type == '十三支'){
      
    }else if(prop?.type == '撿紅點'){
    
    }
  }, []); 

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
      ): (
        <div>die in playing room</div>
      )}
    </div>
  );
}
