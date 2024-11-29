//./conponents/shuffleCards
'use client';

export default function BigTwoShuffleCards() {
  // Initialize a sorted deck of cards (1 through 52)
  const cards = Array.from({ length: 52 }, (_, index) => index + 1);

  // Shuffle the deck using the Fisher-Yates algorithm
  for (let i = cards.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [cards[i], cards[j]] = [cards[j], cards[i]]; // Swap elements
  }

  return cards; // Return the shuffled array
}
