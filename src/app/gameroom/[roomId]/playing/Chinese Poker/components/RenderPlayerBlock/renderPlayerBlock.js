import React, { useState, useEffect } from 'react';
import { updateDoc, doc } from 'firebase/firestore';
import styles from './Page.module.css';
export default function renderPlayerBlock({ prop }) {
    const { roomRef, players, uid, userplace } = prop;
  return <h1>比牌介面</h1>;
}
