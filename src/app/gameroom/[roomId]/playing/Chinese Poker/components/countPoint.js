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
  let result = [{ top: [], middle: [], bottom: [] }];
  let topRow, middleRow, bottomRow;
  playerIds.forEach((playerId, index) => {
    const player = players[playerId];
    if (player?.showCards) {
      playerHandCards[index].top = player.showCards.top || [];
      playerHandCards[index].middle = player.showCards.middle || [];
      playerHandCards[index].bottom = player.showCards.bottom || [];
    }
  });
  //   console.log("info in countPoint", playerHandCards);

  result.top = compare3();
  result.middle = compare5();
  result.bottom = compare5();
}
