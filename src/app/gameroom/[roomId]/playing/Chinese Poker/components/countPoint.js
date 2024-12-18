import { updateDoc, doc } from "firebase/firestore";
import { getDatabase } from "@/utils/firebase.js";
import getCardTypeScore from "./getCardType";

export default async function countPoint({ prop }) {
  const { roomRef, players, userRef } = prop;

  const numPlayers = players.length;
  if (numPlayers < 4) return;

  // Compute each player's scores for top, middle, and bottom rows
  const playerHands = players.map((player) => {
    const topScore = getCardTypeScore(player.rows.top);
    const middleScore = getCardTypeScore(player.rows.middle);
    const bottomScore = getCardTypeScore(player.rows.bottom);
    return { topScore, middleScore, bottomScore };
  });

  function compareHands(a, b) {
    // Compare hand types first
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
        wins++;
      } else if (topCompare === -1) {
        losses++;
      }

      // Compare middle
      const middleCompare = compareHands(
        playerHands[i].middleScore,
        playerHands[j].middleScore
      );
      if (middleCompare === 1) {
        wins++;
      } else if (middleCompare === -1) {
        losses++;
      }

      // Compare bottom
      const bottomCompare = compareHands(
        playerHands[i].bottomScore,
        playerHands[j].bottomScore
      );
      if (bottomCompare === 1) {
        wins++;
      } else if (bottomCompare === -1) {
        losses++;
      }

      // Check for sweep (winning all three rows)
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
      // If a player sweeps every other player
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

  console.log("Score Changes:", scoreChanges);
  const database = await getDatabase();
  const updatedPlayers = {};
  for (let i = 0; i < players.length; i++) {
    const player = players[i];
    updatedPlayers[player.id] = {
      ...player,
      score: (player.score || 0) + scoreChanges[i],
      money:player.money + scoreChanges[i] * 5
    };

    const userRef = doc(database, "user", player.id);
    await updateDoc(userRef, { money: player.money + scoreChanges[i] * 5 });
  }

  await updateDoc(roomRef, { players: updatedPlayers, calculated: true });
}
