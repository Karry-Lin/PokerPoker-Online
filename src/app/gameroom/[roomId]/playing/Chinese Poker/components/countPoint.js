import { updateDoc } from "firebase/firestore";
import getCardTypeScore from "./getCardType";

export default async function countPoint({ prop }) {
  const { roomRef, players } = prop;

  // players is an object keyed by playerId.
  // Extract playerIds
  const numPlayers = players.length;
  if (numPlayers < 4) return;

  // Compute each player's scores
  const playerHands = players.map((playerId) => {
    const player = players[playerId];
    const topScore = getCardTypeScore(player.showCards.top);
    const middleScore = getCardTypeScore(player.showCards.middle);
    const bottomScore = getCardTypeScore(player.showCards.bottom);
    return { topScore, middleScore, bottomScore };
  });

  function compareHands(a, b) {
    if (a[0] > b[0]) return 1;
    if (a[0] < b[0]) return -1;
    // If same hand type, compare their secondary value
    if (a[1] > b[1]) return 1;
    if (a[1] < b[1]) return -1;
    return 0;
  }

  const scoreChanges = new Array(numPlayers).fill(0);
  const sweeps = new Array(numPlayers).fill(0);

  // Pairwise comparison
  for (let i = 0; i < numPlayers; i++) {
    for (let j = 0; j < numPlayers; j++) {
      if (i === j) continue;

      let wins = 0;
      let losses = 0;

      // Compare top
      const topCompare = compareHands(
        playerHands[i].topScore,
        playerHands[j].topScore
      );
      if (topCompare === 1) {
        // scoreChanges[i] += 1;
        // scoreChanges[j] -= 1;
        wins++;
      } else if (topCompare === -1) {
        // scoreChanges[i] -= 1;
        // scoreChanges[j] += 1;
        losses++;
      }

      // Compare middle
      const middleCompare = compareHands(
        playerHands[i].middleScore,
        playerHands[j].middleScore
      );
      if (middleCompare === 1) {
        // scoreChanges[i] += 1;
        // scoreChanges[j] -= 1;
        wins++;
      } else if (middleCompare === -1) {
        // scoreChanges[i] -= 1;
        // scoreChanges[j] += 1;
        losses++;
      }

      // Compare bottom
      const bottomCompare = compareHands(
        playerHands[i].bottomScore,
        playerHands[j].bottomScore
      );
      if (bottomCompare === 1) {
        // scoreChanges[i] += 1;
        // scoreChanges[j] -= 1;
        wins++;
      } else if (bottomCompare === -1) {
        // scoreChanges[i] -= 1;
        // scoreChanges[j] += 1;
        losses++;
      }

      // Check for sweep
      if (wins === 3) {
        scoreChanges[i] += 1;
        scoreChanges[j] -= 1;
        sweeps[i]++;
      }
    }
  }

  // Check if player sweeps all others
  for (let i = 0; i < numPlayers; i++) {
    if (sweeps[i] === numPlayers - 1 && numPlayers > 1) {
      for (let j = 0; j < numPlayers; j++) {
        if (i === j) continue;
        scoreChanges[i] += 3;
        scoreChanges[j] -= 3;
      }
    }
  }

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

  // Special bonuses
  for (let i = 0; i < numPlayers; i++) {
    const topType = getHandTypeName(playerHands[i].topScore);
    const middleType = getHandTypeName(playerHands[i].middleScore);
    const bottomType = getHandTypeName(playerHands[i].bottomScore);

    let bonusFromOthers = 0;

    if (topType === "three_of_a_kind") bonusFromOthers += 1;
    if (bottomType === "four_of_a_kind" || bottomType === "straight_flush")
      bonusFromOthers += 1;
    if (middleType === "four_of_a_kind" || middleType === "straight_flush")
      bonusFromOthers += 2;

    if (bonusFromOthers > 0) {
      for (let j = 0; j < numPlayers; j++) {
        if (i === j) continue;
        scoreChanges[i] += bonusFromOthers;
        scoreChanges[j] -= bonusFromOthers;
      }
    }
  }
  console.log(scoreChanges)
  // Now update the players object
  const updatedPlayers = {};
  players.forEach((playerId, index) => {
    const player = players[playerId];
    updatedPlayers[playerId] = {
      ...player,
      score: (player.score || 0) + scoreChanges[index],
    };
  });

  // Update Firestore
  await updateDoc(roomRef, { players: updatedPlayers });
}
