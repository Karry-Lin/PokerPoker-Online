import { database } from "@/utils/firebase.js";
import {collection, getDocs, orderBy, query} from "firebase/firestore";

export async function GET(request) {
    try {
        const usersCollectionRef = collection(database, 'user');
        const querySnapshot = await getDocs(query(usersCollectionRef, orderBy('money', 'desc')));
        const users = querySnapshot.docs.map((doc) => doc.data());
        users.sort((a, b) => b.money - a.money);
        return Response.json(users, { status: 200 });
    } catch (error) {
        console.error("Error fetching user data:", error);
        return Response.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
}
