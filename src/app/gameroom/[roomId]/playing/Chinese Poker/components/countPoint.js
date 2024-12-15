import React, { useState, useEffect } from "react";
import { updateDoc } from "firebase/firestore";
import compare3 from "./3compare";
import compare5 from "./5compare";
export default function countPoint({ prop }) {
  console.log(prop);
  const { roomRef, players, uid, userplace } = prop;
  let playerHandCards = [
    { top: [], middle: [], bottom: [] },
    { top: [], middle: [], bottom: [] },
    { top: [], middle: [], bottom: [] },
    { top: [], middle: [], bottom: [] },
  ];

  const playerIds = Object.keys(players);
  let result = { top: [], middle: [], bottom: [] };

  let topRow = [];
  let middleRow = [];
  let bottomRow = [];

  playerIds.forEach((playerId, index) => {
    const player = players[playerId];
    if (player?.showCards) {
      playerHandCards[index].top = player.showCards.top || [];
      playerHandCards[index].middle = player.showCards.middle || [];
      playerHandCards[index].bottom = player.showCards.bottom || [];
      topRow.push(player.showCards.top);
      middleRow.push(player.showCards.middle);
      bottomRow.push(player.showCards.bottom);
    }
  });
  console.log("info in topRow", topRow);
  console.log("info in middleRow", middleRow);
  console.log("info in bottomRow", bottomRow);
//   result.top = Array.isArray(compare3(topRow)) ? compare3(topRow) : [];
  result.middle = Array.isArray(compare5(middleRow)) ? compare5(middleRow) : [];
  result.bottom = Array.isArray(compare5(bottomRow)) ? compare5(bottomRow) : [];

  console.log(result);
}
