// Helper function to get card rank
function getRank(card) {
  const rank = ((card - 1) % 13) + 1;
  return rank;
}

// Helper function to get card suit priority (Spades > Hearts > Diamonds > Clubs)
function getSuitPriority(card) {
  if (card <= 13) return 4; // Spades
  if (card <= 26) return 3; // Hearts
  if (card <= 39) return 2; // Diamonds
  return 1; // Clubs
}

// Main comparison function
export default function getPoint(cards1, cards2) {
  // Check if the cards form a valid pair
  const rank1 = getRank(cards1);
  const rank2 = getRank(cards2);
  const suit1 = getSuitPriority(cards1);
  const suit2 = getSuitPriority(cards2);

  // Check for the specific pairing rules
  if (
    (rank1 === 1 && rank2 === 9) ||
    (rank1 === 2 && rank2 === 8) ||
    (rank1 === 3 && rank2 === 7) ||
    (rank1 === 4 && rank2 === 6) ||
    (rank1 === 5 && rank2 === 5) ||
    (rank1 === 10 && rank2 === 10) ||
    (rank1 === 11 && rank2 === 11) ||
    (rank1 === 12 && rank2 === 12) ||
    (rank1 === 13 && rank2 === 13)
  ) {
    // Calculate the points
    let points = 0;
    if (suit1 === 4 || suit2 === 4) {
      // Spades Ace
      points = 30;
    } else if (suit1 === 1 || suit2 === 1) {
      // Clubs Ace
      points = 40;
    } else if (suit1 === 3 || suit2 === 3 || suit1 === 2 || suit2 === 2) {
      // Hearts Ace or Diamonds Ace
      points = 20;
    } else if (rank1 >= 2 && rank1 <= 8) {
      // Red 2 through 8
      points = rank1;
    } else {
      // Red 9 through K
      points = 10;
    }

    // Check for the "Double Red Five" bonus
    if (rank1 === 5 && rank2 === 5) {
      points += 10; // Additional 10 points for all other players
    }

    return points;
  }

  return -1; // Invalid pair
}