import {database} from "@/utils/firebase.js";
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get('userId');
  const userDocRef = doc(database, 'user', userId);
  const userDocSnap = await getDoc(userDocRef);

  if (userDocSnap.exists()) {
    return new Response(JSON.stringify({ message: true }), { status: 200 });
  } else {
    return new Response(JSON.stringify({ message: false }), { status: 404 });
  }
}