// Helper function to get card rank
function getRank(card) {
  const rank = ((card - 1) % 13) + 1;
  return rank;
}

// Helper function to get card suit priority (Spades > Hearts > Diamonds > Clubs)
function getSuitPriority(card) {
  if (card <= 13) return 0; // Spades
  if (card <= 26) return 1; // Hearts
  if (card <= 39) return 1; // Diamonds
  return 0; // Clubs
}
function getValue(card) {
  if (card == 1) return 30;
  else if (card == 14 || card ==27) return 20;
  else if (card == 40) return 40;
  else if (getSuitPriority(card)) {
    return getRank(card) >= 9 ? 10 : getRank(card);
  }
  return 0;
}

export default function getPoint(cards1, cards2) {
  // Get ranks of the cards
  const rank1 = getRank(cards1);
  const rank2 = getRank(cards2);

  // Check first condition: ranks less than 10 and sum is 10
  if (rank1 < 10 && rank2 < 10 && rank1 + rank2 === 10) {
    return getValue(cards1) + getValue(cards2);
  }

  // Check second condition: ranks 10 or higher and ranks are equal
  if (rank1 >= 10 && rank2 >= 10 && rank1 === rank2) {
    return getValue(cards1) + getValue(cards2);
  }

  // If no conditions met, return -1
  return -1;
}
