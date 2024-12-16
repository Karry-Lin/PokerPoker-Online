// getCardType.js
// (Use the provided code as is or in a separate file)
function getRank(card) {
    const rank = ((card - 1) % 13) + 1;
    return rank === 1 ? 14 : rank; // Treat Ace as 14
  }
  
  function getSuitPriority(card) {
    if (card <= 13) return 4; // Spades
    if (card <= 26) return 3; // Hearts
    if (card <= 39) return 2; // Diamonds
    return 1; // Clubs
  }
  
  const straight = [
    [14, 2, 3, 4, 5],
    [3, 4, 5, 6, 7],
    [4, 5, 6, 7, 8],
    [5, 6, 7, 8, 9],
    [6, 7, 8, 9, 10],
    [7, 8, 9, 10, 11],
    [8, 9, 10, 11, 12],
    [9, 10, 11, 12, 13],
    [10, 11, 12, 13, 14],
    [2, 3, 4, 5, 6],
  ];
  
  function isStraight(ranks) {
    const sortedRanks = ranks.slice().sort((a, b) => a - b);
    return straight.some((straightCombo) => {
      const straightSet = new Set(straightCombo);
      return sortedRanks.every((rank) => straightSet.has(rank));
    });
  }
  
  function getHandType(cards) {
    const ranks = cards.map(getRank).sort((a, b) => a - b);
    const suits = cards.map(getSuitPriority);
  
    const isFlush = suits.every((suit) => suit === suits[0]);
    const rankCounts = {};
    ranks.forEach((rank) => (rankCounts[rank] = (rankCounts[rank] || 0) + 1));
    const counts = Object.values(rankCounts).sort((a, b) => b - a);
  
    if (isFlush && isStraight(ranks))
      return { type: "straight_flush", value: Math.max(...ranks), suit: suits[4] };
  
    if (counts[0] === 4)
      return { type: "four_of_a_kind", value: +Object.keys(rankCounts).find((key) => rankCounts[key] === 4) };
  
    if (counts[0] === 3 && counts[1] === 2)
      return { type: "full_house", value: +Object.keys(rankCounts).find((key) => rankCounts[key] === 3) };
  
    if (isFlush)
      return { type: "flush", value: Math.max(...ranks), suit: suits[4] };
  
    if (isStraight(ranks))
      return { type: "straight", value: Math.max(...ranks), suit: suits[4] };
  
    if (counts[0] === 3)
      return { type: "three_of_a_kind", value: +Object.keys(rankCounts).find((key) => rankCounts[key] === 3) };
  
    if (counts[0] === 2 && counts[1] === 2)
      return {
        type: "two_pair",
        value: Math.max(
          ...Object.keys(rankCounts)
            .filter((key) => rankCounts[key] === 2)
            .map(Number)
        ),
      };
  
    if (counts[0] === 2)
      return { type: "one_pair", value: +Object.keys(rankCounts).find((key) => rankCounts[key] === 2) };
  
    return { type: "high_card", value: Math.max(...ranks) };
  }
  
  export default function getCardTypeScore(hand) {
    const typeInfo = getHandType(hand);
    const handHierarchy = {
      high_card: 1,
      one_pair: 2,
      two_pair: 3,
      three_of_a_kind: 4,
      straight: 5,
      flush: 6,
      full_house: 7,
      four_of_a_kind: 8,
      straight_flush: 9,
    };
    return [handHierarchy[typeInfo.type], typeInfo.value];
  }
  