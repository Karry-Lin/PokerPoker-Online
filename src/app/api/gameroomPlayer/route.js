import {database} from "@/utils/firebase.js";
import {collection, deleteField, doc, getDoc, updateDoc} from 'firebase/firestore';

export async function DELETE(request) {
  const {roomId, userId} = await request.json();
  const roomCollection = collection(database, 'room');
  const roomDocRef = doc(roomCollection, roomId);
  await updateDoc(roomDocRef, {
    [`players.${userId}`]: deleteField(),
  });
  return Response.json({message: '已離開房間'}, {status: 201});
}

export async function PUT(request) {
  const {roomId, userId} = await request.json();
  const roomCollection = collection(database, 'room');
  const roomDocRef = doc(roomCollection, roomId);
  const roomDocSnap = await getDoc(roomDocRef);
  const roomData = roomDocSnap.data();
  const players = roomData.players || {};
  const existingPlaces = Object.values(players).map(player => parseInt(player.place));
  let newPlace = 1;
  while (existingPlaces.includes(newPlace)) {
    newPlace++;
  }
  await updateDoc(roomDocRef, {
    [`players.${userId}`]: {
      place: newPlace.toString(),
      handCards: [],
        score: 0,
    }
  });
  return Response.json({message: '已加入房間'}, {status: 201});
}

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const roomId = searchParams.get('roomId');
  const roomCollection = collection(database, 'room');
  const roomDocRef = doc(roomCollection, roomId);
  const roomDocSnap = await getDoc(roomDocRef);
  const roomData = roomDocSnap.data();
  const players = roomData.players || {};
  const playerCount = Object.keys(players).length;
  return Response.json({playerCount}, {status: 200});
}
