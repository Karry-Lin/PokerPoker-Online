import {database, storage} from "@/utils/firebase.js";
import {collection, doc, getDoc, getDocs, query, setDoc, where} from "firebase/firestore";
import {getDownloadURL, ref as refFS, uploadBytes} from 'firebase/storage';

export async function GET(request) {
  const {searchParams} = new URL(request.url);
  const id = searchParams.get('id');
  const docRef = doc(database, `user/${id}`);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    return Response.json(docSnap.data(), {status: 200});
  } else {
    return Response.json({error: `id does not exist`}, {status: 404});
  }
}

export async function PUT(request) {
  const formData = await request.formData();
  const userId = formData.get('userId');
  const username = formData.get('username');
  const password = formData.get('password');
  const confirmPassword = formData.get('confirmPassword');
  const file = formData.get('file');
  const updateData = {};
  const checkUsernameExists = async (username) => {
    const usersCollection = collection(database, 'user');
    const userList = query(usersCollection, where("username", "==", username));
    const querySnapshot = await getDocs(userList);
    return !querySnapshot.empty;
  };
  if (username) {
    if (await checkUsernameExists(username)) {
      return Response.json({error: "username已存在"}, {status: 400});
    } else {
      updateData.username = username;
    }
  }
  if(password){
    if (password.length < 6) {
      return Response.json({error: '密碼長度不可小於6'}, {status: 400});
    }
    if (password !== confirmPassword) {
      return Response.json({error: "密碼和確認密碼不一致"}, {status: 400});
    }
    updateData.password = password;
  }
  if (file instanceof File) {
    const timestamp = Date.now();
    const storageRef = refFS(storage, `userAvatar/${timestamp}_${file.name}`);
    await uploadBytes(storageRef, file);
    updateData.avatar = await getDownloadURL(storageRef);
  }
  const userRef = doc(database, `user/${userId}`);
  await setDoc(userRef, updateData, {merge: true});
  return Response.json({message: '修改成功'}, {status: 200});
}


