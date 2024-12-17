// getCardType.js

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
    return straight.findIndex((straightCombo) => {
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
  
    const straightIndex = isStraight(ranks);
  
    // Determine the hand type and a basic value for tie-break
    let type = "high_card";
    let value = Math.max(...ranks); // default value
    let tiebreakers = []; // We'll fill this based on hand type
  
    if (isFlush && straightIndex >= 0) {
      type = "straight_flush";
      // Just use straightIndex as value
      value = straightIndex;
      tiebreakers = [value]; 
    } else if (counts[0] === 4) {
      type = "four_of_a_kind";
      const fourRank = +Object.keys(rankCounts).find((key) => rankCounts[key] === 4);
      value = fourRank;
      tiebreakers = [value]; 
    } else if (counts[0] === 3 && counts[1] === 2) {
      type = "full_house";
      const threeRank = +Object.keys(rankCounts).find((key) => rankCounts[key] === 3);
      const pairRank = +Object.keys(rankCounts).find((key) => rankCounts[key] === 2);
      // Tiebreak: first three-of-a-kind rank, then pair rank
      tiebreakers = [threeRank, pairRank];
    } else if (isFlush) {
      type = "flush";
      // For flush, to reduce ties, we can compare all ranks in descending order
      tiebreakers = ranks.slice().sort((a,b) => b-a);
    } else if (straightIndex >= 0) {
      type = "straight";
      // Straight index is primary tie-break, but to further reduce ties:
      // Typically the straight's highest card matters. Let's get the actual top card of the straight
      // We'll mimic that by using the ranks in descending order. The top card of the straight can be derived from the pattern.
      const sorted = ranks.slice().sort((a,b) => b-a);
      tiebreakers = [straightIndex, ...sorted];
    } else if (counts[0] === 3) {
      type = "three_of_a_kind";
      const threeRank = +Object.keys(rankCounts).find((key) => rankCounts[key] === 3);
      // Kickers
      const kickers = Object.keys(rankCounts)
        .filter((key) => rankCounts[key] === 1)
        .map(Number)
        .sort((a, b) => b - a);
      tiebreakers = [threeRank, ...kickers];
    } else if (counts[0] === 2 && counts[1] === 2) {
      // Two Pair
      type = "two_pair";
      const pairRanks = Object.keys(rankCounts)
        .filter((key) => rankCounts[key] === 2)
        .map(Number)
        .sort((a, b) => b - a); // Sort pairs by rank descending
      const kicker = Object.keys(rankCounts)
        .filter((key) => rankCounts[key] === 1)
        .map(Number)[0]; // Just one kicker
      // Tiebreakers: high pair, low pair, kicker
      tiebreakers = [...pairRanks, kicker];
    } else if (counts[0] === 2) {
      // One Pair
      type = "one_pair";
      const pairRank = +Object.keys(rankCounts).find((key) => rankCounts[key] === 2);
      // Kickers
      const kickers = Object.keys(rankCounts)
        .filter((key) => rankCounts[key] === 1)
        .map(Number)
        .sort((a, b) => b - a);
      // Tiebreakers: pair rank, then kickers in descending order
      tiebreakers = [pairRank, ...kickers];
    } else {
      // High Card
      type = "high_card";
      // Compare all cards in descending order
      const sortedDesc = ranks.slice().sort((a, b) => b - a);
      tiebreakers = [...sortedDesc];
    }
  
    return { type, tiebreakers };
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
  
    // Return the hierarchy plus the tiebreaker array.
    return [handHierarchy[typeInfo.type], ...typeInfo.tiebreakers];
  }
  