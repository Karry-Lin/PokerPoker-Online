// Helper function to get card rank
function getRank(card) {
  const rank = ((card - 1) % 13) + 1;
  return rank === 1 ? 14 : rank; // Ace is the highest rank
}

// Helper function to get card suit priority (Spades > Hearts > Diamonds > Clubs)
function getSuitPriority(card) {
  if (card <= 13) return 4; // Spades
  if (card <= 26) return 3; // Hearts
  if (card <= 39) return 2; // Diamonds
  return 1; // Clubs
}

// Helper function to check for a straight
function isStraight(ranks) {
  ranks.sort((a, b) => a - b);
  // Check for A2345 straight
  if (
    ranks[0] === 2 &&
    ranks[1] === 3 &&
    ranks[2] === 4 &&
    ranks[3] === 5 &&
    ranks[4] === 14
  ) {
    return true;
  }
  // Regular straight
  for (let i = 1; i < ranks.length; i++) {
    if (ranks[i] !== ranks[i - 1] + 1) return false;
  }
  return true;
}

// Helper function to check for a flush
function isFlush(cards) {
  const suit = Math.ceil(cards[0] / 13);
  return cards.every((card) => Math.ceil(card / 13) === suit);
}

// Evaluate a hand and return its strength
function evaluateHand(cards) {
  const ranks = cards.map(getRank);
  const rankCounts = {};
  ranks.forEach((rank) => (rankCounts[rank] = (rankCounts[rank] || 0) + 1));

  const sortedRanks = [...ranks].sort((a, b) => {
    const freqDiff = rankCounts[b] - rankCounts[a];
    return freqDiff !== 0 ? freqDiff : b - a; // Sort by frequency, then by rank
  });

  const handStrength = { type: 0, score: 0, ranks: sortedRanks };

  // Check for straight flush
  if (isFlush(cards) && isStraight(ranks)) {
    handStrength.type = 8;
    handStrength.score = Math.max(...ranks);
    return handStrength;
  }

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
    handStrength.score = sortedRanks.reduce(
      (acc, rank, i) => acc + rank * Math.pow(100, 4 - i),
      0
    );
    return handStrength;
  }

  // Straight
  if (isStraight(ranks)) {
    handStrength.type = 4;
    handStrength.score = Math.max(...ranks);
    return handStrength;
  }

  // Three of a kind
  if (frequencies[0] === 3) {
    handStrength.type = 3;
    handStrength.score = sortedRanks.reduce(
      (acc, rank, i) => acc + rank * Math.pow(100, 4 - i),
      0
    );
    return handStrength;
  }

  // Two pairs
  if (frequencies[0] === 2 && frequencies[1] === 2) {
    handStrength.type = 2;
    handStrength.score = sortedRanks.reduce(
      (acc, rank, i) => acc + rank * Math.pow(100, 4 - i),
      0
    );
    return handStrength;
  }

  // One pair
  if (frequencies[0] === 2) {
    handStrength.type = 1;
    handStrength.score = sortedRanks.reduce(
      (acc, rank, i) => acc + rank * Math.pow(100, 4 - i),
      0
    );
    return handStrength;
  }

  // High card
  handStrength.type = 0;
  handStrength.score = sortedRanks.reduce(
    (acc, rank, i) => acc + rank * Math.pow(100, 4 - i),
    0
  );
  return handStrength;
}

// Compare two hands and determine the stronger one
function compareHands(hand1, hand2) {
  const eval1 = evaluateHand(hand1);
  const eval2 = evaluateHand(hand2);

  if (eval1.type !== eval2.type) return eval1.type > eval2.type ? 1 : -1;
  if (eval1.score !== eval2.score) return eval1.score > eval2.score ? 1 : -1;

  // Tie-breaking: Compare suits
  const maxSuit1 = Math.max(...hand1.map(getSuitPriority));
  const maxSuit2 = Math.max(...hand2.map(getSuitPriority));
  return maxSuit1 === maxSuit2 ? 0 : maxSuit1 > maxSuit2 ? 1 : -1;
}

// Compare and sort four poker hands
export default function compare5(hand1, hand2, hand3, hand4) {
  const hands = [
    { hand: hand1, index: 1 },
    { hand: hand2, index: 2 },
    { hand: hand3, index: 3 },
    { hand: hand4, index: 4 },
  ];

  hands.sort((a, b) => {
    const comparison = compareHands(a.hand, b.hand);
    return comparison === 0 ? a.index - b.index : comparison;
  });

  return hands.map((h) => h.index);
}
