// Helper function to get card rank with Big Two rules (2 as highest rank)
function getRank(card) {
  const rank = ((card - 1) % 13) + 1;
  if (rank === 2) return 15;
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
    return { type: 'straight_flush', value: Math.max(...ranks) };
  if (counts[0] === 4)
    return {
      type: 'four_of_a_kind',
      value: +Object.keys(rankCounts).find((key) => rankCounts[key] === 4)
    };
  if (counts[0] === 3 && counts[1] === 2)
    return {
      type: 'full_house',
      value: +Object.keys(rankCounts).find((key) => rankCounts[key] === 3)
    };
  if (isStraight) return { type: 'straight', value: Math.max(...ranks) };
  return { type: 'high_card', value: Math.max(...ranks) };
}

// Main comparison function
export default function compare(cards1, cards2) {
  if (cards1.length == 4 || cards1.length == 3) return false;

  if (cards1.length === 1 && cards2.length === 1) {
    // Single card comparison: by rank, then by suit
    const rank1 = getRank(cards1[0]);
    const rank2 = getRank(cards2[0]);
    return rank1 !== rank2
      ? rank1 > rank2
      : getSuitPriority(cards1[0]) > getSuitPriority(cards2[0]);
  }

  if (cards1.length === 2 && cards2.length === 2) {
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

  if (cards1.length === 5 && cards2.length === 5) {
    // Five-card hand comparison
    const hand1 = getHandType(cards1);
    const hand2 = getHandType(cards2);

    const handHierarchy = {
      straight: 1,
      full_house: 1,
      four_of_a_kind: 3,
      straight_flush: 4
    };

    // Compare hand types by hierarchy
    if (handHierarchy[hand1.type] !== handHierarchy[hand2.type]) {
      return handHierarchy[hand1.type] > handHierarchy[hand2.type];
    }

    // If hand types are the same, compare by highest value
    return hand1.value > hand2.value;
  }
  if (cards1.length == 5) {
    const hand1 = getHandType(cards1);
    if (hand1.type == 'straight_flush' || hand1.type == 'four_of_a_kind') {
      return true;
    }
  }
  if (cards2.length == 0) {
    if (cards1.length == 1) {
      return true;
    } else if (cards1.length == 2) {
      if (getRank(cards1[0]) !== getRank(cards1[1])) {
        return false;
      }
      return true;
    } else if (cards1.length == 5) {
      const hand1 = getHandType(cards1);
      if (hand1.type == 'high_card') {
        return false;
      }
      return true;
    } else {
      return false;
    }
  }

  return false; // Fallback case, should not occur if rules are adhered to
}
