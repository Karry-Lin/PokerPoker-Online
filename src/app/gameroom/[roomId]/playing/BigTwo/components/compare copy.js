// // Helper function to get card rank
// // 2 > 1 > 13 > 12 > 11 > 10 > ... > 4 > 3
// function getRank(card) {
//   const num = ((card - 1) % 13) + 1;
//   const rank = num === 1 ? 14 : // Ace becomes highest
//              num === 2 ? 15 : // 2 becomes even higher
//              num;
//   return rank;
// }

// // Helper function to get card suit priority (Spades > Hearts > Diamonds > Clubs)
// function getSuitPriority(card) {
//   if (card <= 13) return 4; // Spades
//   if (card <= 26) return 3; // Hearts
//   if (card <= 39) return 2; // Diamonds
//   return 1; // Clubs
// }

// // Helper function to check if a combination is a straight
// function isStraight(cards) {
//   // Sort cards by rank
//   const sortedRanks = cards.map(getRank).sort((a, b) => a - b);
  
//   // Check if the sorted ranks match any of the predefined straight combinations
//   return straightCombos.some(combo => 
//     combo.every((rank, index) => getRank(cards[index]) === rank)
//   );
// }

// // Helper function to check if a combination is a four of a kind
// function isFourOfAKind(cards) {
//   const ranks = cards.map(getRank);
//   const rankCounts = {};
//   ranks.forEach(rank => {
//     rankCounts[rank] = (rankCounts[rank] || 0) + 1;
//   });
//   return Object.values(rankCounts).includes(4);
// }

// // Helper function to check if a combination is a full house
// function isFullHouse(cards) {
//   const ranks = cards.map(getRank);
//   const rankCounts = {};
//   ranks.forEach(rank => {
//     rankCounts[rank] = (rankCounts[rank] || 0) + 1;
//   });
//   const counts = Object.values(rankCounts);
//   return counts.includes(3) && counts.includes(2);
// }

// // Helper function to check if a combination is a straight flush
// function isStraightFlush(cards) {
//   const suits = cards.map(getSuitPriority);
//   return isStraight(cards) && 
//          suits.every(suit => suit === suits[0]);
// }

// // Predefined straight combinations
// const straightCombos = [
//   [1, 2, 3, 4, 5], 
//   [3, 4, 5, 6, 7], 
//   [4, 5, 6, 7, 8], 
//   [5, 6, 7, 8, 9], 
//   [6, 7, 8, 9, 10], 
//   [7, 8, 9, 10, 11], 
//   [8, 9, 10, 11, 12], 
//   [9, 10, 11, 12, 13], 
//   [10, 11, 12, 13, 1],
//   [2, 3, 4, 5, 6],
// ];

// export default function compare(card1, card2) {
//   // Case 1: Single card
//   if (!Array.isArray(card1) && !Array.isArray(card2)) {
//     return getRank(card1) > getRank(card2) || 
//            (getRank(card1) === getRank(card2) && getSuitPriority(card1) > getSuitPriority(card2));
//   }

//   // Case 2: Pair
//   if (card1.length === 2 && card2.length === 2) {
//     const rank1 = getRank(card1[0]);
//     const rank2 = getRank(card2[0]);
//     return rank1 > rank2;
//   }

//   // Case 5: Five-card combinations
//   if (card1.length === 5 && card2.length === 5) {
//     // Check for different combination types
//     const isStraightFlush1 = isStraightFlush(card1);
//     const isStraightFlush2 = isStraightFlush(card2);
//     const isFourOfAKind1 = isFourOfAKind(card1);
//     const isFourOfAKind2 = isFourOfAKind(card2);
//     const isFullHouse1 = isFullHouse(card1);
//     const isFullHouse2 = isFullHouse(card2);
//     const isStraight1 = isStraight(card1);
//     const isStraight2 = isStraight(card2);

//     // Prioritize combination types
//     if (isStraightFlush1 && !isStraightFlush2) return true;
//     if (!isStraightFlush1 && isStraightFlush2) return false;
//     if (isFourOfAKind1 && !isFourOfAKind2) return true;
//     if (!isFourOfAKind1 && isFourOfAKind2) return false;
//     if (isFullHouse1 && !isFullHouse2) return true;
//     if (!isFullHouse1 && isFullHouse2) return false;
//     if (isStraight1 && !isStraight2) return true;
//     if (!isStraight1 && isStraight2) return false;

//     // If both are of the same type, compare by last card or specific rules
//     if (isStraightFlush1 || isStraight1) {
//       const lastCard1 = card1.reduce((max, curr) => 
//         getRank(curr) > getRank(max) ? curr : max
//       );
//       const lastCard2 = card2.reduce((max, curr) => 
//         getRank(curr) > getRank(max) ? curr : max
//       );
//       return getRank(lastCard1) > getRank(lastCard2);
//     }
//   }

//   // If combinations are not comparable
//   return false;
// }