// Helper function to get card rank
function getRank(card) {
    const rank = ((card - 1) % 13) + 1;
    return rank === 1 ? 14 : rank;
  }
  
  // Helper function to get card suit
  function getSuitPriority(card) {
    if (card <= 13) return 4; // Spades
    if (card <= 26) return 3; // Hearts
    if (card <= 39) return 2; // Diamonds
    return 1; // Clubs
  }
  
  // Helper function to check for straight
  function isStraight(ranks) {
    // Sort ranks in ascending order
    ranks.sort((a, b) => a - b);
    
    // Check for A2345 straight
    if (ranks[0] === 2 && ranks[1] === 3 && ranks[2] === 4 && 
        ranks[3] === 5 && ranks[4] === 14) {
      return true;
    }
    
    // Check for regular straight
    for (let i = 1; i < ranks.length; i++) {
      if (ranks[i] !== ranks[i - 1] + 1) return false;
    }
    return true;
  }
  
  // Helper function to check for flush
  function isFlush(cards) {
    const suit = Math.ceil(cards[0] / 13);
    return cards.every(card => Math.ceil(card / 13) === suit);
  }
  
  // Helper function to evaluate a hand
  function evaluateHand(cards) {
    const ranks = cards.map(getRank);
    const rankCounts = {};
    ranks.forEach(rank => {
      rankCounts[rank] = (rankCounts[rank] || 0) + 1;
    });
    
    const sortedRanks = [...ranks].sort((a, b) => {
      // First sort by frequency
      const freqDiff = rankCounts[b] - rankCounts[a];
      if (freqDiff !== 0) return freqDiff;
      // Then by rank value
      return b - a;
    });
    
    const handStrength = {
      type: 0, // Hand type (8=straight flush, 7=four of kind, etc.)
      score: 0,
      ranks: sortedRanks
    };
    
    // Check for straight flush
    if (isFlush(cards) && isStraight(ranks)) {
      handStrength.type = 8;
      // Special case for A2345 straight flush
      if (sortedRanks[0] === 14 && sortedRanks[1] === 5) {
        handStrength.score = 5; // Rank of the highest card in wheel straight
      } else {
        handStrength.score = Math.max(...ranks);
      }
      return handStrength;
    }
    
    // Count frequencies
    const frequencies = Object.values(rankCounts).sort((a, b) => b - a);
    
    // Four of a kind
    if (frequencies[0] === 4) {
      handStrength.type = 7;
      handStrength.score = sortedRanks[0];
      return handStrength;
    }
    
    // Full house
    if (frequencies[0] === 3 && frequencies[1] === 2) {
      handStrength.type = 6;
      handStrength.score = sortedRanks[0] * 100 + sortedRanks[3];
      return handStrength;
    }
    
    // Flush
    if (isFlush(cards)) {
      handStrength.type = 5;
      handStrength.score = sortedRanks.reduce((acc, rank, i) => acc + rank * Math.pow(100, 4-i), 0);
      return handStrength;
    }
    
    // Straight
    if (isStraight(ranks)) {
      handStrength.type = 4;
      // Special case for A2345 straight
      if (sortedRanks[0] === 14 && sortedRanks[1] === 5) {
        handStrength.score = 5; // Rank of the highest card in wheel straight
      } else {
        handStrength.score = Math.max(...ranks);
      }
      return handStrength;
    }
    
    // Three of a kind
    if (frequencies[0] === 3) {
      handStrength.type = 3;
      handStrength.score = sortedRanks.reduce((acc, rank, i) => acc + rank * Math.pow(100, 4-i), 0);
      return handStrength;
    }
    
    // Two pairs
    if (frequencies[0] === 2 && frequencies[1] === 2) {
      handStrength.type = 2;
      handStrength.score = sortedRanks.reduce((acc, rank, i) => acc + rank * Math.pow(100, 4-i), 0);
      return handStrength;
    }
    
    // One pair
    if (frequencies[0] === 2) {
      handStrength.type = 1;
      handStrength.score = sortedRanks.reduce((acc, rank, i) => acc + rank * Math.pow(100, 4-i), 0);
      return handStrength;
    }
    
    // High card
    handStrength.type = 0;
    handStrength.score = sortedRanks.reduce((acc, rank, i) => acc + rank * Math.pow(100, 4-i), 0);
    return handStrength;
  }
  
  // Helper function to compare two hands
  function compareHands(hand1, hand2) {
    const eval1 = evaluateHand(hand1);
    const eval2 = evaluateHand(hand2);
    
    if (eval1.type !== eval2.type) {
      return eval1.type > eval2.type ? 1 : -1;
    }
    
    if (eval1.score !== eval2.score) {
      return eval1.score > eval2.score ? 1 : -1;
    }
    
    // If everything is equal, compare by highest card suit
    const maxSuit1 = Math.max(...hand1.map(getSuitPriority));
    const maxSuit2 = Math.max(...hand2.map(getSuitPriority));
    
    return maxSuit1 === maxSuit2 ? 0 : (maxSuit1 > maxSuit2 ? 1 : -1);
  }
  
  export default function compare3(cards1, cards2, card3, card4) {
    // Create array of hands with their original indices
    const hands = [
      { hand: cards1, index: 1 },
      { hand: cards2, index: 2 },
      { hand: card3, index: 3 },
      { hand: card4, index: 4 }
    ];
    
    // Sort hands based on strength
    hands.sort((a, b) => {
      const comparison = compareHands(a.hand, b.hand);
      return comparison === 0 ? a.index - b.index : comparison;
    });
    
    // Return array of indices in order from weakest to strongest hand
    return hands.map(h => h.index);
  }