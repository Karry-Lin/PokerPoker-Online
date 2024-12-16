import { updateDoc } from "firebase/firestore";
import getCardTypeScore from "./getCardType";

export default async function countPoint({ prop }) {
  const { roomRef, players } = prop;

  const playerIds = Object.keys(players);

  // Extract each player's sets of cards
  const playerHandCards = playerIds.map((playerId) => {
    const player = players[playerId];
    return {
      top: player?.showCards?.top || [],
      middle: player?.showCards?.middle || [],
      bottom: player?.showCards?.bottom || [],
    };
  });

  // Scoring scheme per row:
  // 1st place: +3 points
  // 2nd place: +1 point
  // 3rd place: -1 point
  // 4th place: -3 points
  const scoring = [3, 1, -1, -3];

  // Helper to rank players in a given row
  // Returns an array of points corresponding to the player index (0-3)
  function rankRow(rowHands) {
    // Evaluate all players' scores: [ [hierarchy, value], ... ]
    const results = rowHands.map((hand) =>
      hand && hand.length > 0 ? getCardTypeScore(hand) : [0, 0]
    );

    // Sort players by hierarchy desc, then by value desc
    // resultsWithIndex = [{idx, hierarchy, value}, ...]
    const resultsWithIndex = results.map((r, idx) => ({ 
      idx, hierarchy: r[0], value: r[1] 
    }));

    resultsWithIndex.sort((a, b) => {
      // Sort by hierarchy desc
      if (b.hierarchy !== a.hierarchy) return b.hierarchy - a.hierarchy;
      // If tie, sort by value desc
      return b.value - a.value;
    });

    // Assign scores
    // After sorting, resultsWithIndex[0] is best, [1] second, etc.
    const rowPoints = new Array(rowHands.length).fill(0);
    for (let rank = 0; rank < resultsWithIndex.length; rank++) {
      const playerIdx = resultsWithIndex[rank].idx;
      rowPoints[playerIdx] = scoring[rank];
    }

    return rowPoints;
  }

  // Rank each row
  const topRowPoints = rankRow(playerHandCards.map((p) => p.top));
  const middleRowPoints = rankRow(playerHandCards.map((p) => p.middle));
  const bottomRowPoints = rankRow(playerHandCards.map((p) => p.bottom));

  // Sum up points for each player across the three rows
  const playerScores = {};
  playerIds.forEach((id, i) => {
    const totalPoints = topRowPoints[i] + middleRowPoints[i] + bottomRowPoints[i];
    playerScores[id] = totalPoints;
  });

  // Update Firestore with the new scores
  const updatedPlayers = {};
  playerIds.forEach((playerId) => {
    updatedPlayers[playerId] = {
      ...players[playerId],
      score: (players[playerId].score || 0) + playerScores[playerId],
    };
  });

  // await updateDoc(roomRef, {
  //   players: updatedPlayers,
  // });
}
