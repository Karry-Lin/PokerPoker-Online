import {database} from "@/utils/firebase.js";
import {collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where} from 'firebase/firestore';
import {v4 as uuidv4} from "uuid";

export async function POST(request) {
    const {userId, name, password, type} = await request.json();
    const checkRoomnameExists = async (name) => {
        const roomCollection = collection(database, 'room');
        const roomList = query(roomCollection, where("name", "==", name));
        const querySnapshot = await getDocs(roomList);
        return !querySnapshot.empty;
    };

    if (name.length > 15) {
        return Response.json({error: '房間名稱長度不可大於15'}, {status: 400});
    }
    if (await checkRoomnameExists(name)) {
        return Response.json({error: '此房間名稱已存在'}, {status: 400});
    }
    if (password && password.length < 6) {
        return Response.json({error: '密碼長度不可小於6'}, {status: 400});
    }
    const docRef = doc(database, `user/${userId}`);
    const docSnap = await getDoc(docRef);
    const data = docSnap.data();
    const roomId = uuidv4();
    const roomRef = doc(database, `room/${roomId}`);
    await setDoc(roomRef, {
        id: roomId,
        name,
        password,
        type,
        players: {
            [userId]: {
                username: data.username,
                avatar: data.avatar,
                money: data.money,
                place: 1,
                handCards: [],
                score: 0,
                ready: false,
            },
        },
        turn: 0,
        nowCards: [],
        state: 'waiting',
        time: new Date().toISOString()
    });
    return Response.json({message: '創建成功', roomId}, {status: 201});
}

export async function DELETE(request) {
    const {roomId} = await request.json();
    const roomCollection = collection(database, 'room');
    const roomDocRef = doc(roomCollection, roomId);
    const roomDocSnap = await getDoc(roomDocRef);
    if (!roomDocSnap.exists())
        return Response.json({error: `id does not exist`}, {status: 404});
    const roomData = roomDocSnap.data();
    if (roomData.players && Object.keys(roomData.players).length === 0) {
        await deleteDoc(roomDocRef);
        return Response.json({message: '刪除成功'}, {status: 201});
    }
    return Response.json({error: '房間還有玩家'}, {status: 400});
}

export async function GET(request) {
    const {searchParams} = new URL(request.url);
    const id = searchParams.get('id');
    if (id) {
        const docRef = doc(database, `room/${id}`);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            return Response.json(docSnap.data(), {status: 200});
        } else {
            return Response.json({error: `id does not exist`}, {status: 404});
        }
    } else {
        const roomCollection = collection(database, 'room');
        const roomList = await getDocs(roomCollection);
        const rooms = roomList.docs.map((doc) => doc.data());
        return Response.json(rooms, {status: 200});
    }
}
