import { database } from "@/utils/firebase.js";
import {collection, getDocs, orderBy, query} from "firebase/firestore";

export async function GET(request) {
    try {
        const {searchParams} = new URL(request.url);
        const id = searchParams.get('id');
        if(id === 'user')
        {
            const usersCollectionRef = collection(database, 'user');
            const querySnapshot = await getDocs(query(usersCollectionRef, orderBy('money', 'desc')));
            const users = querySnapshot.docs.map((doc) => doc.data());
            users.sort((a, b) => b.money - a.money);
            return Response.json(users, { status: 200 });
        }
        if(id === "room")
        {
            const roomCollection = collection(database, 'room');
            const roomList = await getDocs(query(roomCollection, orderBy('time', 'desc')));
            const rooms = roomList.docs.map((doc) => doc.data());
            return Response.json(rooms, {status: 200});
        }
    } catch (error) {
        console.error("Error fetching user data:", error);
        return Response.json({ error: "Failed to fetch user data" }, { status: 500 });
    }
}
