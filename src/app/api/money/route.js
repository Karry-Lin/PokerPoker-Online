import {database} from "@/utils/firebase.js";
import {doc, setDoc} from 'firebase/firestore';

export async function PUT(request) {
  const {userId, money} = await request.json();
  const userRef = doc(database, `user/${userId}`);
  const newMoney = Number(money) + 50;
  if(newMoney >= 1000) {
    return Response.json({error: '加值金額不可超過1000'}, {status: 400});
  }
  await setDoc(userRef, { money: newMoney }, {merge: true});
  return Response.json({message: '加值成功', userId }, {status: 200});
}
