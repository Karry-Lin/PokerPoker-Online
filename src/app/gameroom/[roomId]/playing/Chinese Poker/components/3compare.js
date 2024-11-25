// Helper function to get card rank
function getRank(card) {
    const rank = ((card - 1) % 13) + 1;
    return rank === 1 ? 14 : rank; // Ace is highest (14)
  }
  
  // Helper function to get card suit priority
  function getSuitPriority(card) {
    if (card <= 13) return 4; // Spades
    if (card <= 26) return 3; // Hearts
    if (card <= 39) return 2; // Diamonds
    return 1; // Clubs
  }
  
  // Helper function to evaluate a hand
  function evaluateHand(cards) {
    const ranks = cards.map(getRank).sort((a, b) => b - a);
    const handStrength = {
      rank: ranks,
      type: 1, // 1: high card, 2: one pair, 3: three of a kind
      score: 0
    };
  
    // Check for three of a kind
    if (ranks[0] === ranks[1] && ranks[1] === ranks[2]) {
      handStrength.type = 3;
      handStrength.score = ranks[0] * 1000000;
      return handStrength;
    }
  
    // Check for one pair
    for (let i = 0; i < 2; i++) {
      if (ranks[i] === ranks[i + 1]) {
        handStrength.type = 2;
        handStrength.score = ranks[i] * 10000 + ranks[ranks[i] === ranks[0] ? 2 : 0];
        return handStrength;
      }
    }
  
    // High card
    handStrength.score = ranks[0] * 100 + ranks[1] * 10 + ranks[2];
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
  
    // If everything is equal, compare by suit of highest card
    const maxSuit1 = Math.max(...hand1.map(getSuitPriority));
    const maxSuit2 = Math.max(...hand2.map(getSuitPriority));
    
    return maxSuit1 === maxSuit2 ? 0 : (maxSuit1 > maxSuit2 ? 1 : -1);
  }
  
  export default function compare3(cards1, cards2, card3, card4) {
    // Create arrays for each hand
    const hand1 = cards1;
    const hand2 = cards2;
    const hand3 = card3;
    const hand4 = card4;
  
    // Create array of hands with their original indices
    const hands = [
      { hand: hand1, index: 1 },
      { hand: hand2, index: 2 },
      { hand: hand3, index: 3 },
      { hand: hand4, index: 4 }
    ];
  
    // Sort hands based on strength
    hands.sort((a, b) => {
      const comparison = compareHands(a.hand, b.hand);
      return comparison === 0 ? a.index - b.index : comparison;
    });
  
    // Return array of indices in order from weakest to strongest hand
    return hands.map(h => h.index);
  }