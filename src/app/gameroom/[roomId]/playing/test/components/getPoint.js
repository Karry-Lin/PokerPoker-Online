export default function getPoint(cards1, cards2) {
  //card1,card2 will be two cards ranging from 1 to 52
  //1 to 13 is spade
  //14 to 26 is heart
  //27 to 39 is diamond
  //40 to 52 is club
  
  // Get the suit and number for each card
  const getCardDetails = (card) => {
    const number = ((card - 1) % 13) + 1;
    const suit = Math.floor((card - 1) / 13); // 0:spade, 1:heart, 2:diamond, 3:club
    return { number, suit };
  };

  const card1 = getCardDetails(cards1);
  const card2 = getCardDetails(cards2);

  // Check if it's a valid pair
  const isPair = (n1, n2) => {
    if (n1 === n2) {
      return [10, 11, 12, 13].includes(n1); // pairs of 10,11,12,13
    }
    return (n1 === 1 && n2 === 9) || (n1 === 9 && n2 === 1) ||
           (n1 === 2 && n2 === 8) || (n1 === 8 && n2 === 2) ||
           (n1 === 3 && n2 === 7) || (n1 === 7 && n2 === 3) ||
           (n1 === 4 && n2 === 6) || (n1 === 6 && n2 === 4) ||
           (n1 === 5 && n2 === 5);
  };

  // If not a pair, return -1
  if (!isPair(card1.number, card2.number)) {
    return -1;
  }

  // Calculate points (only for hearts and diamonds)
  const getPoints = (card) => {
    // Only count points for hearts (1) and diamonds (2)
    if (card.suit !== 1 && card.suit !== 2) {
      return 0;
    }
    // For cards 11, 12, 13, return 10 points
    return card.number > 10 ? 10 : card.number;
  };

  return getPoints(card1) + getPoints(card2);
}
