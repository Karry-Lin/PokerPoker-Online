import { updateDoc } from "firebase/firestore";
import getCardTypeScore from "./getCardType";

export default async function countPoint({ prop }) {
  const { roomRef, players } = prop;

  // Number of players
  const numPlayers = players.length; // Expecting 4 players as given
  if (numPlayers < 4) return;
  // Extract each player's top/middle/bottom hands and compute their scores
  const playerHands = players.map((player) => {
    const topScore = getCardTypeScore(player.showCards.top);
    const middleScore = getCardTypeScore(player.showCards.middle);
    const bottomScore = getCardTypeScore(player.showCards.bottom);

    return {
      topScore,
      middleScore,
      bottomScore,
    };
  });

  // Utility function to compare two hands: return 1 if a>b, -1 if a<b, 0 if equal
  function compareHands(a, b) {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    // Same hand type, compare value
    if (a[1] > b[1]) return 1;
    if (a[1] < b[1]) return -1;
    return 0;
  }

  // Initialize an array for tracking score changes (start from 0 for each player)
  const scoreChanges = new Array(numPlayers).fill(0);

  // For tracking how many players each player sweeps (wins all three rows)
  const sweeps = new Array(numPlayers).fill(0);

  // Pairwise comparisons
  for (let i = 0; i < numPlayers; i++) {
    for (let j = 0; j < numPlayers; j++) {
      if (i === j) continue;
      let wins = 0;
      let losses = 0;

      // Compare top row
      const topCompare = compareHands(
        playerHands[i].topScore,
        playerHands[j].topScore
      );
      if (topCompare === 1) {
        scoreChanges[i] += 1;
        scoreChanges[j] -= 1;
        wins++;
      } else if (topCompare === -1) {
        scoreChanges[i] -= 1;
        scoreChanges[j] += 1;
        losses++;
      }

      // Compare middle row
      const middleCompare = compareHands(
        playerHands[i].middleScore,
        playerHands[j].middleScore
      );
      if (middleCompare === 1) {
        scoreChanges[i] += 1;
        scoreChanges[j] -= 1;
        wins++;
      } else if (middleCompare === -1) {
        scoreChanges[i] -= 1;
        scoreChanges[j] += 1;
        losses++;
      }

      // Compare bottom row
      const bottomCompare = compareHands(
        playerHands[i].bottomScore,
        playerHands[j].bottomScore
      );
      if (bottomCompare === 1) {
        scoreChanges[i] += 1;
        scoreChanges[j] -= 1;
        wins++;
      } else if (bottomCompare === -1) {
        scoreChanges[i] -= 1;
        scoreChanges[j] += 1;
        losses++;
      }

      // If player i won all three rows against player j
      if (wins === 3) {
        // Extra 1 point from j to i
        scoreChanges[i] += 1;
        scoreChanges[j] -= 1;
        // Mark that i swept j
        sweeps[i]++;
      }
    }
  }

  // If a player has swept all other players (i.e., sweeps[i] === numPlayers - 1),
  // they get an additional 3 points from each other player
  for (let i = 0; i < numPlayers; i++) {
    if (sweeps[i] === numPlayers - 1 && numPlayers > 1) {
      // Player i has beaten everyone in all 3 rows
      // Extra 3 points from each other player
      for (let j = 0; j < numPlayers; j++) {
        if (i === j) continue;
        scoreChanges[i] += 3;
        scoreChanges[j] -= 3;
      }
    }
  }

  // Special hand bonuses:
  // Conditions:
  // topRow == three_of_a_kind => +1 from each other
  // bottomRow == four_of_a_kind or straight_flush => +1 from each other
  // middleRow == four_of_a_kind or straight_flush => +2 from each other

  // We need to know the hand types by name to apply conditions. Let's map from the numeric rank back to a name or just re-derive type name:
  const handTypeNames = {
    1: "high_card",
    2: "one_pair",
    3: "two_pair",
    4: "three_of_a_kind",
    5: "straight",
    6: "flush",
    7: "full_house",
    8: "four_of_a_kind",
    9: "straight_flush",
  };

  function getHandTypeName(handScore) {
    return handTypeNames[handScore[0]];
  }

  for (let i = 0; i < numPlayers; i++) {
    const topType = getHandTypeName(playerHands[i].topScore);
    const middleType = getHandTypeName(playerHands[i].middleScore);
    const bottomType = getHandTypeName(playerHands[i].bottomScore);

    let bonusFromOthers = 0;

    // top row three_of_a_kind => +1 from each other
    if (topType === "three_of_a_kind") {
      bonusFromOthers += 1;
    }

    // bottom row four_of_a_kind or straight_flush => +1 from each other
    if (bottomType === "four_of_a_kind" || bottomType === "straight_flush") {
      bonusFromOthers += 1;
    }

    // middle row four_of_a_kind or straight_flush => +2 from each other
    if (middleType === "four_of_a_kind" || middleType === "straight_flush") {
      bonusFromOthers += 2;
    }

    if (bonusFromOthers > 0) {
      // Apply this bonus: i gets bonusFromOthers * (numPlayers - 1)
      // and each other player loses bonusFromOthers
      for (let j = 0; j < numPlayers; j++) {
        if (i === j) continue;
        scoreChanges[i] += bonusFromOthers;
        scoreChanges[j] -= bonusFromOthers;
      }
    }
  }

  // Now we have all final score changes for each player
  const updatedPlayers = players.map((player, index) => ({
    ...player,
    score: player.score + scoreChanges[index],
  }));
  console.log(updatedPlayers);
  // Update the database
  await updateDoc(roomRef, { players: updatedPlayers });
}
