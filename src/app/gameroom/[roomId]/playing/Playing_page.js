'use client';
import { useEffect } from 'react';
import BigTwo from './BigTwo/BigTwo';
import ChinesePoker from './Chinese Poker/ChinesePoker';
import ChineseRummy from './Chinese Rummy/ChineseRummy';
import Test from './test/Test';
import shuffleCards from './BigTwo/conponents/shuffleCards';
export default function PlayingPage({ prop }) {
  const [deck, setDeck] = useState([]);
  const [roomData,setRoomData] = useState(prop);
  useEffect(() => {
    const shuffledDeck = shuffleCards();
    setDeck(shuffledDeck);
    // console.log(shuffledDeck);
  }, []);
  useEffect(() => {
    if(prop?.roomData?.type === '大老二'){
      
    }else if(prop?.roomData?.type === '十三支'){
      
    }else if(prop?.roomData?.type === '撿紅點'){
      
    }
  }, []); 

  return (
    <div>
      {prop?.roomData?.type === '大老二' ? (
        <BigTwo prop={prop} />
      ) : prop?.roomData?.type === '十三支' ? (
        <ChinesePoker prop={prop} />
      ) : prop?.roomData?.type === '撿紅點' ? (
        <ChineseRummy prop={prop} />
      ) : prop?.roomData?.type === 'test' ? (
        <Test prop={prop} />
      ): (
        <div>Unknown state</div>
      )}
    </div>
  );
}
