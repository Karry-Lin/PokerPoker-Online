import {database} from "@/utils/firebase.js";
import {collection, getDocs, query, where} from 'firebase/firestore';

export async function POST(request) {
  const {email, password} = await request.json();
  const userQuery = query(
    collection(database, 'user'),
    where('email', '==', email),
    where('password', '==', password)
  );
  const queryResult = await getDocs(userQuery);
  if (!queryResult.empty) {
    const userDoc = queryResult.docs[0];
    const userId = userDoc.id;
    return Response.json({message: '登入成功', userId }, {status: 200});
  } else {
    return Response.json({error: '帳號或密碼錯誤'}, {status: 401});
  }
}
