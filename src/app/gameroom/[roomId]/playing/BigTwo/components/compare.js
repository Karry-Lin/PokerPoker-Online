// Helper function to get card rank with Big Two rules (2 as highest rank)
function getRank(card) {
  const rank = ((card - 1) % 13) + 1;
  return rank === 1 ? 14 : rank; // Treat Ace as 14 for Big Two ranking
}

// Helper function to get card suit priority (Spades > Hearts > Diamonds > Clubs)
function getSuitPriority(card) {
  if (card <= 13) return 4; // Spades
  if (card <= 26) return 3; // Hearts
  if (card <= 39) return 2; // Diamonds
  return 1; // Clubs
}

// Helper function to identify hand type for five-card hands
function getHandType(cards) {
  const ranks = cards.map(getRank).sort((a, b) => a - b);
  const suits = cards.map(getSuitPriority);
  const isFlush = suits.every((suit) => suit === suits[0]);
  const isStraight = ranks.every(
    (rank, i, arr) => i === 0 || rank === arr[i - 1] + 1
  );
  const rankCounts = {};
  ranks.forEach((rank) => (rankCounts[rank] = (rankCounts[rank] || 0) + 1));
  const counts = Object.values(rankCounts).sort((a, b) => b - a);

  if (isFlush && isStraight)
    return { type: "straight_flush", value: Math.max(...ranks) };
  if (counts[0] === 4)
    return {
      type: "four_of_a_kind",
      value: +Object.keys(rankCounts).find((key) => rankCounts[key] === 4),
    };
  if (counts[0] === 3 && counts[1] === 2)
    return {
      type: "full_house",
      value: +Object.keys(rankCounts).find((key) => rankCounts[key] === 3),
    };
  if (isStraight) return { type: "straight", value: Math.max(...ranks) };
  return { type: "high_card", value: Math.max(...ranks) };
}

// Main comparison function
export default function compare(cards1, cards2) {
  // Handle five-card hands first to establish hierarchy
  if (cards1.length === 5 && cards2.length === 5) {
    const hand1 = getHandType(cards1);
    const hand2 = getHandType(cards2);
    
    // Modified hierarchy to make full_house and straight at same level
    // and not bigger than other hands except four_of_a_kind and straight_flush
    const handHierarchy = {
      high_card: 1,
      straight: 1,      // Same level as high_card
      full_house: 1,    // Same level as high_card and straight
      four_of_a_kind: 2,
      straight_flush: 2
    };

    // Compare hand types by hierarchy
    if (handHierarchy[hand1.type] !== handHierarchy[hand2.type]) {
      return handHierarchy[hand1.type] > handHierarchy[hand2.type];
    }

    // If both hands are straight or full_house, treat them as equal
    if ((hand1.type === 'straight' && hand2.type === 'full_house') ||
        (hand1.type === 'full_house' && hand2.type === 'straight')) {
      return false;
    }

    // If hand types are the same, compare by highest value
    return hand1.value > hand2.value;
  }

  if (cards1.length === 1) {
    // Handle case where comparing against a five-card hand
    if (cards2.length === 5) {
      const hand2 = getHandType(cards2);
      if (hand2.type === 'four_of_a_kind' || hand2.type === 'straight_flush') {
        return false;
      }
    }
    
    // Single card comparison: by rank, then by suit
    const rank1 = getRank(cards1[0]);
    const rank2 = getRank(cards2[0]);
    return rank1 !== rank2
      ? rank1 > rank2
      : getSuitPriority(cards1[0]) > getSuitPriority(cards2[0]);
  }

  if (cards1.length === 2) {
    // Handle case where comparing against a five-card hand
    if (cards2.length === 5) {
      const hand2 = getHandType(cards2);
      if (hand2.type === 'four_of_a_kind' || hand2.type === 'straight_flush') {
        return false;
      }
    }
    
    // Pair comparison: check for same rank in each pair
    if (
      getRank(cards1[0]) !== getRank(cards1[1]) ||
      getRank(cards2[0]) !== getRank(cards2[1])
    ) {
      return false;
    }
    const rank1 = getRank(cards1[0]);
    const rank2 = getRank(cards2[0]);
    if (rank1 !== rank2) return rank1 > rank2;
    // If pairs are the same rank, compare highest suit
    return (
      Math.max(getSuitPriority(cards1[0]), getSuitPriority(cards1[1])) >
      Math.max(getSuitPriority(cards2[0]), getSuitPriority(cards2[1]))
    );
  }

  return false; // Fallback case, should not occur if rules are adhered to
}

